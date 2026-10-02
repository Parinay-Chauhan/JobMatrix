import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email format"),
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["candidate", "recruiter"]).default("candidate"),
});

export const loginUserSchema = z.object({
  email: z.string().trim().optional(),
  username: z.string().trim().optional(),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
}).refine((data) => data.email || data.username, {
  message: "Either email or username is required",
});
