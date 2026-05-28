import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";
import { HTTP_STATUS } from "../constants/index.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, roomNumber, hostelBlock } = req.body;

  const result = await authService.register({
    name,
    email,
    password,
    role,
    roomNumber,
    hostelBlock,
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(HTTP_STATUS.CREATED)
    .cookie("accessToken", result.accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", result.refreshToken, options)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        result,
        "User registered successfully",
      ),
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", result.accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", result.refreshToken, options)
    .json(new ApiResponse(HTTP_STATUS.OK, result, "Logged in successfully"));
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await authService.logout(req.user._id, refreshToken);

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(HTTP_STATUS.OK, null, "Logged out successfully"));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  const result = await authService.refreshToken(token);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", result.accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", result.refreshToken, options)
    .json(
      new ApiResponse(HTTP_STATUS.OK, result, "Token refreshed successfully"),
    );
});

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
