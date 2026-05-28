import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import userService from "../services/user.service.js";
import complaintService from "../services/complaint.service.js";
import { HTTP_STATUS } from "../constants/index.js";

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

export const assignComplaint = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;

  const complaint = await complaintService.updateComplaint(req.params.id, {
    assignedTo,
    status: "Assigned",
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        complaint,
        "Complaint assigned successfully",
      ),
    );
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, adminRemarks, rejectionReason } = req.body;

  const updateData = { status };
  if (adminRemarks) updateData.adminRemarks = adminRemarks;
  if (rejectionReason && status === "Rejected")
    updateData.rejectionReason = rejectionReason;

  const complaint = await complaintService.updateComplaint(
    req.params.id,
    updateData,
  );

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        complaint,
        "Complaint status updated successfully",
      ),
    );
});

export const getSystemStats = asyncHandler(async (req, res) => {
  const complaintStats = await complaintService.getComplaintStats();
  const usersCount = await userService.getAllUsers({ limit: 1 });

  const stats = {
    complaints: complaintStats,
    totalUsers: usersCount.pagination.total,
    totalStudents: (
      await userService.getAllUsers({ role: "student", limit: 1 })
    ).pagination.total,
    totalAdmin: (await userService.getAllUsers({ role: "admin", limit: 1 }))
      .pagination.total,
  };

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        stats,
        "System statistics fetched successfully",
      ),
    );
});

export const deactivateUser = asyncHandler(async (req, res) => {
  await userService.deactivateUser(req.params.id);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, null, "User deactivated successfully"),
    );
});

export const activateUser = asyncHandler(async (req, res) => {
  const user = await userService.activateUser(req.params.id);

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, user, "User activated successfully"));
});
