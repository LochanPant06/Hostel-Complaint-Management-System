import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { HTTP_STATUS } from "../constants/index.js";

class UserService {
  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user;
  }

  async getAllUsers(options = {}) {
    const { page = 1, limit = 10, role, search } = options;

    const query = {};

    if (role) query.role = role;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateUser(userId, updateData) {
    const allowedFields = ["name", "roomNumber", "hostelBlock", "avatar"];
    const filteredData = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const user = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    logger.info("User updated successfully", { userId });

    return user;
  }

  async deactivateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    logger.info("User deactivated", { userId });

    return user;
  }

  async activateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true },
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    logger.info("User activated", { userId });

    return user;
  }
}

export default new UserService();
