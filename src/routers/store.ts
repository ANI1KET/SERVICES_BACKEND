import { Router } from "express";

import {
  reviewStore,
  createStore,
  deleteStore,
  storeDetails,
  allStoreDetails,
  updateStoreDetails,
} from "../controllers/store.js";
import { errorHandler } from "../utils/error_handler.js";

const roomRoutes: Router = Router();

// GET
roomRoutes.get("/", errorHandler(allStoreDetails));
roomRoutes.get("/:storeId", errorHandler(storeDetails));
// POST
roomRoutes.post("/create", errorHandler(createStore));
roomRoutes.post("/review", errorHandler(reviewStore));
// PUT
roomRoutes.put("/:storeId", errorHandler(updateStoreDetails));
// DElETE
roomRoutes.delete("/:storeId", errorHandler(deleteStore));

export default roomRoutes;
