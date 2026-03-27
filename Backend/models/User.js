// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: [true, "Password is required"],
    },
    role: {
      type:    String,
      enum:    ["student", "admin"],
      default: "student",
    },
    roomNo:      { type: String, default: "" },
    hostelBlock: { type: String, default: "" },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// NO pre save middleware — hashing is done in authRoutes.js

module.exports = mongoose.model("User", userSchema);