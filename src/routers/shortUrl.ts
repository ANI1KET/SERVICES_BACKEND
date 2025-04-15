import { Router } from "express";

import authMiddleware from "../middlewares/auth.js";
import { errorHandler } from "../utils/error_handler.js";
import { redirectUrl, shortUrl } from "../controllers/shortUrl.js";

const urlRoutes: Router = Router();

// GET
urlRoutes.get("/:shortId", errorHandler(redirectUrl));
// POST
urlRoutes.post("/short", authMiddleware, errorHandler(shortUrl));
// PUT
// DElETE

export default urlRoutes;
