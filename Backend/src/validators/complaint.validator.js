import { z } from "zod";

export const createComplaintSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters"),
    category: z.enum([
      "Plumbing",
      "Electricity",
      "Cleaning",
      "Furniture",
      "Other",
    ]),
    priority: z.enum(["Low", "Medium", "High"]).optional().default("Medium"),
    hostelBlock: z.string().min(1, "Hostel block is required"),
    roomNumber: z.string().min(1, "Room number is required"),
  }),
});

export const updateComplaintSchema = z.object({
  body: z.object({
    status: z
      .enum(["Pending", "Assigned", "In Progress", "Resolved", "Rejected"])
      .optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    adminRemarks: z.string().max(500).optional(),
    rejectionReason: z.string().max(500).optional(),
    assignedTo: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-f]{24}$/, "Invalid complaint ID"),
  }),
});

export const getComplaintSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-f]{24}$/, "Invalid complaint ID"),
  }),
});

export const listComplaintsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    status: z.string().optional(),
    priority: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});
