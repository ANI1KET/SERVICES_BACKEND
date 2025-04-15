import { Router } from "express";

import authMiddleware from "../middlewares/auth.js";
import { upgradeUser } from "../controllers/premium.js";
import { errorHandler } from "../utils/error_handler.js";

const premiumRoutes: Router = Router();

// GET
// POST
premiumRoutes.post("/add", authMiddleware, errorHandler(upgradeUser));
// PUT
// DElETE

export default premiumRoutes;
