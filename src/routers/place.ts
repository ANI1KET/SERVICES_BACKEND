import { Router } from "express";

import { citiesLocation, cityLocation } from "../controllers/place";
import { errorHandler } from "../utils/error_handler";

const placeRoutes: Router = Router();

// GET
placeRoutes.get("/cities-locations", errorHandler(citiesLocation));
placeRoutes.get("/city-locations", errorHandler(cityLocation));
// POST
// PUT
// DElETE

export default placeRoutes;
