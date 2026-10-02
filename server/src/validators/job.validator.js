import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string({ required_error: "Job title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string({ required_error: "Job description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters"),
  requirements: z.union([
    z.array(z.string()),
    z.string().transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean)),
  ]).optional(),
  location: z.string().trim().default("Remote"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]).default("Full-time"),
  workMode: z.enum(["Remote", "Hybrid", "On-site"]).default("Remote"),
  category: z.string().trim().default("Software Development"),
  experienceLevel: z.enum(["Entry-level", "Mid-level", "Senior-level"]).default("Mid-level"),
  salary: z.coerce.number().min(0).default(0),
  positions: z.coerce.number().min(1).default(1),
});
