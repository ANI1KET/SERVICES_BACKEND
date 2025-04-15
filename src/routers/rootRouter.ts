import { Router } from "express";

import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import roomRoutes from "./room.js";
import placeRoutes from "./place.js";
import urlRoutes from "./shortUrl.js";
import premiumRoutes from "./premium.js";
import promoterRoutes from "./promoter.js";
import interestedRoomsRoutes from "./interestedrooms.js";

const rootRoute: Router = Router();

rootRoute.use("/url", urlRoutes);
rootRoute.use("/auth", authRoutes);
rootRoute.use("/user", userRoutes);
rootRoute.use("/room", roomRoutes);
rootRoute.use("/place", placeRoutes);
rootRoute.use("/premium", premiumRoutes);
rootRoute.use("/promote", promoterRoutes);
rootRoute.use("/interestedrooms", interestedRoomsRoutes);

export default rootRoute;
