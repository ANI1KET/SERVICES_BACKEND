import { Router } from "express";

import { upgradeUser } from "../controllers/premium.js";
import { errorHandler } from "../utils/error_handler.js";

const premiumRoutes: Router = Router();

// GET
// POST
premiumRoutes.post("/add", errorHandler(upgradeUser));
// PUT
// DElETE

export default premiumRoutes;
