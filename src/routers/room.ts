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
import { errorHandler } from "../utils/error_handler.js";

const roomRoutes: Router = Router();

// GET
roomRoutes.get("/", errorHandler(allRoomDetails));
roomRoutes.get("/:roomId", errorHandler(roomDetails));
// POST
roomRoutes.post("/create", errorHandler(createRoom));
roomRoutes.post("/review", errorHandler(reviewRoom));
roomRoutes.post("/:roomId/book", errorHandler(bookRoom));
roomRoutes.post("/rooms", errorHandler(multipleRoomDetails));
// PUT
roomRoutes.put("/:roomId", errorHandler(updateRoomDetails));
// DElETE
roomRoutes.delete("/:roomId", errorHandler(deleteRoom));

export default roomRoutes;
