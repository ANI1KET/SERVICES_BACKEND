import { Router } from "express";

import {
  bookRoom,
  createRoom,
  reviewRoom,
  deleteRoom,
  roomDetails,
  allRoomDetails,
  updateRoomDetails,
  multipleRoomDetails,
} from "../controllers/room.js";
import authMiddleware from "../middlewares/auth.js";
import { errorHandler } from "../utils/error_handler.js";

const roomRoutes: Router = Router();

// GET
roomRoutes.get("/", errorHandler(allRoomDetails));
roomRoutes.get("/:roomId", errorHandler(roomDetails));
// POST
roomRoutes.post("/create", authMiddleware, errorHandler(createRoom));
roomRoutes.post("/review", authMiddleware, errorHandler(reviewRoom));
roomRoutes.post("/:roomId/book", errorHandler(bookRoom));
roomRoutes.post("/rooms", errorHandler(multipleRoomDetails));
// PUT
roomRoutes.put("/:roomId", errorHandler(updateRoomDetails));
// DElETE
roomRoutes.delete("/:roomId", errorHandler(deleteRoom));

export default roomRoutes;
