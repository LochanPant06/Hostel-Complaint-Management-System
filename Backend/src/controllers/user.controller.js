import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import userService from "../services/user.service.js";
import { HTTP_STATUS } from "../constants/index.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        req.user,
        "Current user fetched successfully",
      ),
    );
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, user, "User fetched successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, result, "Users fetched successfully"),
    );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.user._id, req.body);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, user, "Profile updated successfully"),
    );
});

export const deactivateAccount = asyncHandler(async (req, res) => {
  await userService.deactivateUser(req.user._id);

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
      new ApiResponse(HTTP_STATUS.OK, null, "Account deactivated successfully"),
    );
});
