"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSchema = void 0;
const zod_1 = require("zod");
exports.ReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().refine((val) => val >= 0 && val <= 5, {
        message: "Rating must be in between 0 and 5",
    }),
    comment: zod_1.z.string().min(5, { message: "Comment must not be empty" }),
    roomForRentId: zod_1.z.string().length(24), // Assuming MongoDB ObjectId
    userId: zod_1.z.string().length(24), // Assuming MongoDB ObjectId
});
