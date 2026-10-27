const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendMail } = require("../utils/mailer");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "candidate") {
      query.candidate = req.user.id;
    } else if (req.user.role === "recruiter") {
      const jobs = await Job.find({ recruiter: req.user.id }).select("_id");
      query.job = { $in: jobs.map((job) => job._id) };
    }

    const applications = await Application.find(query)
      .populate("candidate", "name email")
      .populate({ path: "job", select: "title company location", populate: { path: "company", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Unable to load applications" });
  }
});

router.post("/", authenticate, authorize("candidate"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.body.job)) {
    return res.status(400).json({ message: "A valid job id is required" });
  }
  try {
    if (!(await Job.exists({ _id: req.body.job }))) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (await Application.exists({ job: req.body.job, candidate: req.user.id })) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }
    const application = await Application.create({
      job: req.body.job,
      candidate: req.user.id,
      coverLetter: req.body.coverLetter,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: "Unable to create application", error: error.message });
  }
});

router.patch("/:id/status", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid application id" });
  }
  if (!Application.schema.path("status").enumValues.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid application status" });
  }
  try {
    const application = await Application.findById(req.params.id)
      .populate("candidate", "name email")
      .populate({
        path: "job",
        select: "title company recruiter",
        populate: { path: "company", select: "name" },
      });
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (req.user.role !== "admin" && application.job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update applications for your jobs" });
    }
    const statusChanged = application.status !== req.body.status;
    application.status = req.body.status;
    await application.save();

    let notificationSent = null;
    if (statusChanged) {
      const nextStep = req.body.status === "Shortlisted"
        ? "You have been selected for the next round. The recruiter will contact you with details."
        : req.body.status === "Reviewing"
          ? "The employer is reviewing your application."
          : req.body.status === "Rejected"
            ? "The employer has decided not to move forward with your application at this time."
            : `Your application status is now ${req.body.status}.`;
      const companyName = application.job.company?.name || "the employer";
      try {
        await sendMail({
          to: application.candidate.email,
          subject: `Application update: ${req.body.status}`,
          text: `Hi ${application.candidate.name},\n\n${nextStep}\n\nPosition: ${application.job.title}\nCompany: ${companyName}\n\nSign in to JobConnect to view your applications.`,
        });
        notificationSent = true;
      } catch (emailError) {
        console.error("Application status email failed:", emailError.message);
      }
    }
    res.json({ application, notificationSent });
  } catch (error) {
    res.status(400).json({ message: "Unable to update application", error: error.message });
  }
});

module.exports = router;