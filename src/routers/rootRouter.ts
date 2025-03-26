import { Router } from "express";

import authRoutes from "./auth.js";
import roomRoutes from "./room.js";
import placeRoutes from "./place.js";
import premiumRoutes from "./premium.js";
import interestedRoomsRoutes from "./interestedrooms.js";

const rootRoute: Router = Router();

rootRoute.use("/auth", authRoutes);
rootRoute.use("/room", roomRoutes);
rootRoute.use("/place", placeRoutes);
rootRoute.use("/premium", premiumRoutes);
rootRoute.use("/interestedrooms", interestedRoomsRoutes);

export default rootRoute;
