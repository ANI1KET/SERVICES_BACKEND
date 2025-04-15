import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

import rootRoute from "./routers/rootRouter.js";
import { errorMiddleware } from "./middlewares/errors.js";

const app: Express = express();

export const prismaClient = new PrismaClient({
  log: ["query"],
});

const limiter = rateLimit({
  max: 50,
  windowMs: 10 * 60 * 1000,
  message: "Too many requests, please try again later.",
});

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://services.aniketrouniyar.com.np",
    credentials: true,
  })
);
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", rootRoute);
app.use(errorMiddleware);

export default app;
