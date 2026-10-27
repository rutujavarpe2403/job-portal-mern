const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name location logo")
      .populate("recruiter", "email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Unable to load jobs" });
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  try {
    const job = await Job.findById(req.params.id).populate("company", "name location logo");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Unable to load job" });
  }
});

router.post("/", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const { title, company: companyName, location, type, salary, experience, skills, description, responsibilities } = req.body;
    if (!title || !companyName || !description) {
      return res.status(400).json({ message: "Title, company, and description are required" });
    }

    let company = await Company.findOne({ name: companyName.trim(), recruiter: req.user.id });
    if (!company) {
      company = await Company.create({ name: companyName.trim(), recruiter: req.user.id });
    }

    const job = await Job.create({
      title,
      company: company._id,
      location,
      jobType: type,
      salary,
      experience,
      skills,
      description,
      responsibilities,
      recruiter: req.user.id,
    });
    await job.populate(["company", "recruiter"]);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: "Unable to create job", error: error.message });
  }
});

router.patch("/:id", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (req.user.role !== "admin" && job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own jobs" });
    }
    Object.assign(job, req.body, { recruiter: job.recruiter });
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: "Unable to update job", error: error.message });
  }
});

router.delete("/:id", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid job id" });
  }
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (req.user.role !== "admin" && job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete job" });
  }
});

module.exports = router;