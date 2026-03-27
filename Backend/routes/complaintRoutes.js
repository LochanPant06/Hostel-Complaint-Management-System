const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint.js");
const { protect, adminOnly } = require("../middleware/authMiddleware.js");

// STUDENT: Submit a complaint
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const complaint = await Complaint.create({
      student: req.user.id,
      title, description, category
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// STUDENT: Get MY complaints
router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Get ALL complaints
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email roomNo")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Update complaint status + remark
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminRemark },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;