import { Router } from "express";
import {
  createHostel,
  reviewHostel,
  deletehostel,
  hostelDetails,
  allhostelDetails,
  updatehostelDetails,
} from "../controllers/hostel";
import { errorHandler } from "../utils/error_handler";

const roomRoutes: Router = Router();

// GET
roomRoutes.get("/", errorHandler(allhostelDetails));
roomRoutes.get("/:hostelId", errorHandler(hostelDetails));
// POST
roomRoutes.post("/create", errorHandler(createHostel));
roomRoutes.post("/review", errorHandler(reviewHostel));
// PUT
roomRoutes.put("/:hostelId", errorHandler(updatehostelDetails));
// DElETE
roomRoutes.delete("/:hostelId", errorHandler(deletehostel));

export default roomRoutes;
