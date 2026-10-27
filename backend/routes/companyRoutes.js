const express = require("express");
const mongoose = require("mongoose");
const Company = require("../models/Company");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await Company.find().sort({ name: 1 }));
  } catch (error) {
    res.status(500).json({ message: "Unable to load companies" });
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid company id" });
  }
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Unable to load company" });
  }
});

router.post("/", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, recruiter: req.user.id });
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: "Unable to create company", error: error.message });
  }
});

module.exports = router;