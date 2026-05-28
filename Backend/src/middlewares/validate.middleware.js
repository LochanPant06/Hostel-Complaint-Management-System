import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/index.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.validated = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || error.errors || [];
        const errors = issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation error", errors);
      }

      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid request");
    }
  };
};

export default validateRequest;
