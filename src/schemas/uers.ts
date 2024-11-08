import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  name: z.string().min(1, "Name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
      "Password must contain uppercase, lowercase, and number"
    ),
  number: z
    .string()
    .length(10, "Number must be exactly 10 digits long")
    .regex(/^\d+$/, "Number must contain only digits"),
  role: z.enum(["ADMIN", "OWNER", "BROKER", "USER"]).default("USER"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
