import { Router } from "express";

import {
  getInterestedRooms,
  createInterestedRoom,
  deleteInterestedRoom,
} from "../controllers/interestedrooms.js";
import { errorHandler } from "../utils/error_handler.js";

const interestedRoomsRoutes: Router = Router();

// GET
interestedRoomsRoutes.get("/", errorHandler(getInterestedRooms));
// POST
interestedRoomsRoutes.post("/create", errorHandler(createInterestedRoom));
// PUT
// DElETE
interestedRoomsRoutes.delete("/delete", errorHandler(deleteInterestedRoom));

export default interestedRoomsRoutes;
