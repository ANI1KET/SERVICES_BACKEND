import { Router } from "express";

import authMiddleware from "../middlewares/auth.js";
import { updateNumber } from "../controllers/user.js";
import { errorHandler } from "../utils/error_handler.js";

const userRoutes: Router = Router();

// GET
// POST
userRoutes.post("/number", authMiddleware, errorHandler(updateNumber));
// PUT
// DElETE

export default userRoutes;
