import { z } from "zod";

export const categorySchema = z.enum(
  ["room", "hostel", "property", "reMarketItem"],
  // ["room", "hostel", "property", "vehicle", "reMarketItem"],
  {
    errorMap: () => ({
      message:
        'Value should be one of: "room", "hostel", "property", "reMarketItem"',
    }),
  }
);

export const citySchema = z.string().min(1, { message: "Specify the city." });
