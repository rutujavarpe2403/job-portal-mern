const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Company = require("../models/Company");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Unable to load users" });
  }
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Admin accounts cannot be removed" });

    if (user.role === "recruiter") {
      const jobs = await Job.find({ recruiter: user._id }).select("_id");
      await Application.deleteMany({ job: { $in: jobs.map((job) => job._id) } });
      await Job.deleteMany({ recruiter: user._id });
      await Company.deleteMany({ recruiter: user._id });
    } else {
      await Application.deleteMany({ candidate: user._id });
    }
    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: "Unable to remove user" });
  }
});

module.exports = router;