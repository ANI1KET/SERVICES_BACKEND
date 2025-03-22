import { Router } from "express";

import {
  citiesLocation,
  cityLocations,
  cityLocationsData,
} from "../controllers/place.js";
import { errorHandler } from "../utils/error_handler.js";

const placeRoutes: Router = Router();

// GET
placeRoutes.get("/cities-locations", errorHandler(citiesLocation));
placeRoutes.get("/city-locations", errorHandler(cityLocations));
placeRoutes.get("/:id", errorHandler(cityLocationsData));
// POST
// PUT
// DElETE

export default placeRoutes;
