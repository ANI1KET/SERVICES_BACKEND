import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z.number().refine((val) => val >= 0 && val <= 5, {
    message: "Rating must be in between 0 and 5",
  }),
  comment: z.string().min(5, { message: "Comment must not be empty" }),
  roomId: z.string().length(24), // Assuming MongoDB ObjectId
  userId: z.string().length(24), // Assuming MongoDB ObjectId
});
