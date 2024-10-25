import { Router } from "express";
import authRoutes from "./auth";
import roomRoutes from "./room";

const rootRoute: Router = Router();

rootRoute.use("/auth", authRoutes);
rootRoute.use("/rooms", roomRoutes);

export default rootRoute;
