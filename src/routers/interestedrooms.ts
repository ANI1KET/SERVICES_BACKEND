import { Router } from "express";

import {
  getInterestedRooms,
  createInterestedRoom,
  deleteInterestedRoom,
} from "../controllers/interestedrooms.js";
import authMiddleware from "../middlewares/auth.js";
import { errorHandler } from "../utils/error_handler.js";

const interestedRoomsRoutes: Router = Router();

// GET
interestedRoomsRoutes.get("/", errorHandler(getInterestedRooms));
// POST
interestedRoomsRoutes.post(
  "/create",
  authMiddleware,
  errorHandler(createInterestedRoom)
);
// PUT
// DElETE
interestedRoomsRoutes.delete("/delete", errorHandler(deleteInterestedRoom));

export default interestedRoomsRoutes;
