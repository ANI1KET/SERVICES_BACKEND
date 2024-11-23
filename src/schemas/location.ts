import { z } from "zod";

export const categorySchema = z.enum(
  ["room", "store", "hostel", "restaurant", "land", "repair", "rental"],
  {
    errorMap: () => ({
      message:
        'Value should be one of: "room", "store", "hostel", "restaurant", "land", "repair", "rental"',
    }),
  }
);

export const citySchema = z.string().min(1, { message: "Specify the city." });
