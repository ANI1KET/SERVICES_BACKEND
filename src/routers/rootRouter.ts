import { Router } from "express";
import authRoutes from "./auth";
import roomRoutes from "./room";
import placeRoutes from "./place";

const rootRoute: Router = Router();

rootRoute.use("/auth", authRoutes);
rootRoute.use("/room", roomRoutes);
rootRoute.use("/place", placeRoutes);

export default rootRoute;
