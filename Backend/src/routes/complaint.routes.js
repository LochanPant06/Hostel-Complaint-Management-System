import { Router } from "express";
import {
  createComplaint,
  getComplaintById,
  getMyComplaints,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getComplaintStats,
} from "../controllers/complaint.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { USER_ROLES, HTTP_STATUS } from "../constants/index.js";
import {
  createComplaintSchema,
  updateComplaintSchema,
  getComplaintSchema,
  listComplaintsSchema,
} from "../validators/complaint.validator.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  validateRequest(createComplaintSchema),
  createComplaint,
);

router.get(
  "/my",
  verifyJWT,
  validateRequest(listComplaintsSchema),
  getMyComplaints,
);

router.get(
  "/all",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.WARDEN),
  validateRequest(listComplaintsSchema),
  getAllComplaints,
);

router.get("/stats", verifyJWT, getComplaintStats);

router.get(
  "/:id",
  verifyJWT,
  validateRequest(getComplaintSchema),
  getComplaintById,
);

router.put(
  "/:id",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.WARDEN, USER_ROLES.MAINTENANCE),
  validateRequest(updateComplaintSchema),
  updateComplaint,
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(USER_ROLES.ADMIN),
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-f]{24}$/i)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid complaint ID");
    }
    next();
  }),
  deleteComplaint,
);

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
