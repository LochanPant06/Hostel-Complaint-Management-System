import "dotenv/config";

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "https://hostel-complaint-management-system-cpgt.onrender.com",
  RATE_LIMIT_WINDOW_MS: toNumber(
    process.env.RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  ),
  RATE_LIMIT_MAX_REQUESTS: toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
};

const validateEnv = () => {
  const requiredVars = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
  const missing = requiredVars.filter((variable) => !process.env[variable]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

validateEnv();

export default env;
