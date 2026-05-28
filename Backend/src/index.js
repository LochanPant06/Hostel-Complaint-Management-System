import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import logger from "./utils/logger.js";

const PORT = env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`, {
        environment: env.NODE_ENV,
      });
    });
  })
  .catch((error) => {
    logger.error("Database connection failed", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
