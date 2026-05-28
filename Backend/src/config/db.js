import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.js";
import { env } from "./env.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const instance = await mongoose.connect(env.MONGO_URI, {
      dbName: DB_NAME,
    });

    logger.info("MongoDB connected", {
      host: instance.connection.host,
      database: DB_NAME,
    });

    return instance;
  } catch (error) {
    logger.error("MongoDB connection error", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

export default connectDB;
