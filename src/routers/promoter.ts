import { Router } from "express";

import {
  getListerRooms,
  getPromoterDetails,
  getPromotingDetails,
} from "../controllers/promoter.js";
import authMiddleware from "../middlewares/auth.js";
import { errorHandler } from "../utils/error_handler.js";

const promoterRoutes: Router = Router();

// GET
promoterRoutes.get("/room", authMiddleware, errorHandler(getPromotingDetails));
promoterRoutes.get(
  "/listerrooms",
  authMiddleware,
  errorHandler(getListerRooms)
);
promoterRoutes.get(
  "/:userId",
  authMiddleware,
  errorHandler(getPromoterDetails)
);
// POST
// PUT
// DElETE

export default promoterRoutes;
