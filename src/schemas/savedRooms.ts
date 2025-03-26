import { z } from "zod";

export const InterestedRoomsSchema = z.object({
  userId: z.string().length(24),
  roomId: z.string().length(24),
  listerId: z.string().length(24),
});
