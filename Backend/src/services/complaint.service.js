import Complaint from "../models/Complaint.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { HTTP_STATUS } from "../constants/index.js";

class ComplaintService {
  async createComplaint(complaintData, userId) {
    const complaint = await Complaint.create({
      ...complaintData,
      createdBy: userId,
    });

    const populated = await complaint.populate("createdBy", "name email role");

    logger.info("Complaint created successfully", {
      complaintId: complaint._id,
      userId,
    });

    return populated;
  }

  async getComplaintById(id) {
    const complaint = await Complaint.findById(id)
      .populate("createdBy", "name email roomNumber hostelBlock")
      .populate("assignedTo", "name email role");

    if (!complaint) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Complaint not found");
    }

    return complaint;
  }

  async getUserComplaints(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      search,
    } = options;

    const query = {
      createdBy: userId,
      isDeleted: false,
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      complaints,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAllComplaints(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      search,
      assignedTo,
    } = options;

    const query = { isDeleted: false };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate("createdBy", "name email roomNumber hostelBlock")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      complaints,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateComplaint(id, updateData) {
    const complaint = await Complaint.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Complaint not found");
    }

    if (updateData.status === "Resolved") {
      complaint.resolvedAt = new Date();
      await complaint.save();
    }

    logger.info("Complaint updated successfully", {
      complaintId: id,
      updates: Object.keys(updateData),
    });

    return complaint;
  }

  async deleteComplaint(id) {
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!complaint) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Complaint not found");
    }

    logger.info("Complaint deleted successfully", { complaintId: id });

    return complaint;
  }

  async getComplaintStats(userId = null) {
    const matchStage = userId
      ? { createdBy: userId, isDeleted: false }
      : { isDeleted: false };

    const stats = await Complaint.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
          },
          assigned: {
            $sum: { $cond: [{ $eq: ["$status", "Assigned"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
          },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        total: 0,
        pending: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
      }
    );
  }
}

export default new ComplaintService();
