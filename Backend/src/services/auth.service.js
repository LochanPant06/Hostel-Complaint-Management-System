import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { HTTP_STATUS } from "../constants/index.js";

class AuthService {
  async register(userData) {
    const { name, email, password, role, roomNumber, hostelBlock } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already registered");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      roomNumber,
      hostelBlock,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    logger.info("User registered successfully", {
      userId: user._id,
      email: user.email,
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    user.lastLogin = new Date();
    await user.save();

    logger.info("User logged in successfully", {
      userId: user._id,
      email: user.email,
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId, refreshToken) {
    await RefreshToken.updateOne(
      { token: refreshToken, user: userId },
      { isRevoked: true },
    );

    logger.info("User logged out successfully", { userId });
  }

  async refreshToken(token) {
    const refreshTokenDoc = await RefreshToken.findOne({
      token,
      isRevoked: false,
    });

    if (!refreshTokenDoc) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or revoked refresh token",
      );
    }

    if (refreshTokenDoc.expiresAt < new Date()) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token has expired");
    }

    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not found");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    await RefreshToken.updateOne(
      { _id: refreshTokenDoc._id },
      { isRevoked: true },
    );

    await RefreshToken.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export default new AuthService();
