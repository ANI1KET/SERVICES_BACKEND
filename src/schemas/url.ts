import { z } from "zod";

export const urlValidation = z.object({
  userId: z.string().length(24),
  roomId: z.string().length(24),
  listerId: z.string().length(24),
  // originalUrl: z
  //   .string()
  //   .url("Invalid URL format")
  //   .refine(
  //     (url) => {
  //       try {
  //         const parsed = new URL(url);
  //         return parsed.hostname === "aniketrouniyar.com.np";
  //       } catch {
  //         return false;
  //       }
  //     },
  //     {
  //       message: "URL must be from aniketrouniyar.com.np",
  //     }
  //   ),
});
