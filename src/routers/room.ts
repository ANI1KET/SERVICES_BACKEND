import { Router } from "express";

import {
  createRoom,
  bookRoom,
  reviewRoom,
  roomDetails,
  allRoomDetails,
  updateRoomDetails,
  deleteRoom,
} from "../controllers/room.js";
import { errorHandler } from "../utils/error_handler.js";

const roomRoutes: Router = Router();

// GET
roomRoutes.get("/", errorHandler(allRoomDetails));
roomRoutes.get("/:roomId", errorHandler(roomDetails));
// POST
roomRoutes.post("/create", errorHandler(createRoom));
roomRoutes.post("/:roomId/book", errorHandler(bookRoom));
roomRoutes.post("/review", errorHandler(reviewRoom));
// PUT
roomRoutes.put("/:roomId", errorHandler(updateRoomDetails));
// DElETE
roomRoutes.delete("/:roomId", errorHandler(deleteRoom));

export default roomRoutes;
