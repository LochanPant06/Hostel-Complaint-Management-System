import mongoose from "mongoose";
import {
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY,
  COMPLAINT_CATEGORY,
} from "../constants/index.js";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: 10,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: [
        COMPLAINT_CATEGORY.PLUMBING,
        COMPLAINT_CATEGORY.ELECTRICITY,
        COMPLAINT_CATEGORY.CLEANING,
        COMPLAINT_CATEGORY.FURNITURE,
        COMPLAINT_CATEGORY.OTHER,
      ],
      required: [true, "Category is required"],
      index: true,
    },
    priority: {
      type: String,
      enum: [
        COMPLAINT_PRIORITY.LOW,
        COMPLAINT_PRIORITY.MEDIUM,
        COMPLAINT_PRIORITY.HIGH,
      ],
      default: COMPLAINT_PRIORITY.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      enum: [
        COMPLAINT_STATUS.PENDING,
        COMPLAINT_STATUS.ASSIGNED,
        COMPLAINT_STATUS.IN_PROGRESS,
        COMPLAINT_STATUS.RESOLVED,
        COMPLAINT_STATUS.REJECTED,
      ],
      default: COMPLAINT_STATUS.PENDING,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    hostelBlock: {
      type: String,
      required: [true, "Hostel block is required"],
      index: true,
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
    },
    attachments: [
      {
        url: String,
        publicId: String,
      },
    ],
    adminRemarks: {
      type: String,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

complaintSchema.index({ createdBy: 1, createdAt: -1 });
complaintSchema.index({ assignedTo: 1, status: 1 });
complaintSchema.index({ category: 1, status: 1 });

complaintSchema.pre(/^find/, function (next) {
  if (!this.options._recursed) {
    this.where({ isDeleted: false });
    this.options._recursed = true;
  }
  next();
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
