import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validators/auth.validator.js";
import { HTTP_STATUS } from "../constants/index.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh-token", validateRequest(refreshTokenSchema), refreshToken);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);

function validateRequest(schema) {
  return asyncHandler(async (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.validated = validated;
      next();
    } catch (error) {
      const issues = error.issues || error.errors || [];
      const errors = issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation error", errors);
    }
  });
}

export default router;
