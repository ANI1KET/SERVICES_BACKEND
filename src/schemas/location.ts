import { z } from "zod";

export const categorySchema = z.enum([
  "room",
  "store",
  "hostel",
  "restaurant",
  "land",
  "book",
  "car",
]);

export const locationSchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
});
