import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";

import rootRoute from "./routers/rootRouter";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", rootRoute);
app.use(errorMiddleware);

export default app;
