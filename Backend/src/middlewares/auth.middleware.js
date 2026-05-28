import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { HTTP_STATUS } from "../constants/index.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token is required");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "User account is deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired token");
  }
});

export default verifyJWT;
