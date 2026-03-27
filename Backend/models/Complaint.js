// backend/models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ["plumbing", "electricity", "cleaning", "furniture", "other"], required: true },
  status:      { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  adminRemark: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);