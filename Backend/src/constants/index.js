export const DB_NAME = "hostel_complaint_system";

export const COMPLAINT_STATUS = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

export const COMPLAINT_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const COMPLAINT_CATEGORY = {
  PLUMBING: "Plumbing",
  ELECTRICITY: "Electricity",
  CLEANING: "Cleaning",
  FURNITURE: "Furniture",
  OTHER: "Other",
};

export const USER_ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
  WARDEN: "warden",
  MAINTENANCE: "maintenance",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "15m",
  REFRESH_TOKEN: "7d",
};
