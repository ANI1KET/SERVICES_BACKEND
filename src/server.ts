import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";

import { PORT } from "./env_variable";
import rootRoute from "./routers/rootRouter";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", rootRoute);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server Running on Port : ${PORT}`);
});
