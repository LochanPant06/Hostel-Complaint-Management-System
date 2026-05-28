import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  getAllUsers,
  updateProfile,
  deactivateAccount,
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { USER_ROLES, HTTP_STATUS } from "../constants/index.js";

const router = Router();

router.get("/me", verifyJWT, getCurrentUser);

router.get("/", verifyJWT, authorizeRoles(USER_ROLES.ADMIN), getAllUsers);

router.get(
  "/:id",
  verifyJWT,
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-f]{24}$/i)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid user ID");
    }
    next();
  }),
  getUserById,
);

router.patch("/profile", verifyJWT, updateProfile);

router.delete("/deactivate", verifyJWT, deactivateAccount);

export default router;
