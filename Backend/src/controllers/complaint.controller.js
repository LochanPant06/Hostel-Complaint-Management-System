import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import complaintService from "../services/complaint.service.js";
import { HTTP_STATUS } from "../constants/index.js";

export const createComplaint = asyncHandler(async (req, res) => {
  const complaint = await complaintService.createComplaint(
    req.body,
    req.user._id,
  );

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        complaint,
        "Complaint created successfully",
      ),
    );
});

export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await complaintService.getComplaintById(req.params.id);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        complaint,
        "Complaint fetched successfully",
      ),
    );
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const result = await complaintService.getUserComplaints(
    req.user._id,
    req.query,
  );

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        result,
        "Complaints fetched successfully",
      ),
    );
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const result = await complaintService.getAllComplaints(req.query);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        result,
        "Complaints fetched successfully",
      ),
    );
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await complaintService.updateComplaint(
    req.params.id,
    req.body,
  );

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        complaint,
        "Complaint updated successfully",
      ),
    );
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  await complaintService.deleteComplaint(req.params.id);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, null, "Complaint deleted successfully"),
    );
});

export const getComplaintStats = asyncHandler(async (req, res) => {
  const userId = req.query.userId ? req.user._id : null;
  const stats = await complaintService.getComplaintStats(userId);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        stats,
        "Complaint statistics fetched successfully",
      ),
    );
});
