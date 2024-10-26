import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  number: z
    .string()
    .min(10, "Number must be at least 10 digits long")
    .max(15, "Number must be at most 15 digits long")
    .regex(/^\d+$/, "Number must contain only digits"),
  role: z.enum(["ADMIN", "OWNER", "BROKER", "USER"]).default("USER"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
