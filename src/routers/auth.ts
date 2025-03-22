import { Router } from "express";

import { signUp } from "../controllers/auth.js";
import { errorHandler } from "../utils/error_handler.js";
// import authMiddleware from "../middlewares/auth";
// import adminMiddleware from "../middlewares/admin";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandler(signUp));
// authRoutes.post("/login", errorHandler(login));
// authRoutes.get("/me", [authMiddleware], errorHandler(me));
// authRoutes.get("/me", [authMiddleware, adminMiddleware], errorHandler(me));

export default authRoutes;
