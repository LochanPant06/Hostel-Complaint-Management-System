import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message);
  }

  logger.error("API Error", {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    path: req.path,
    method: req.method,
  });

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
