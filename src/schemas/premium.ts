import { z } from "zod";

export const upgradeUserSchema = z.object({
  permission: z.enum([
    "room",
    "land",
    "store",
    "hostel",
    "repair",
    "rental",
    "restaurant",
  ]),
  userId: z.string().length(24),
  durationInDays: z
    .number()
    .int()
    .positive("Duration must be a positive number"),
  role: z.enum(["OWNER", "BROKER"]),
});
