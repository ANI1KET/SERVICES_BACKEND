// import { PrismaClient } from "@prisma/client";
// import express, { Express } from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import rootRoute from "./routers/rootRouter";
// import { errorMiddleware } from "./middlewares/errors";

// const app: Express = express();

// export const prismaClient = new PrismaClient({
//   log: ["query"],
// });

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api", rootRoute);
// app.use(errorMiddleware);

// export default app;

import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import rootRoute from "./routers/rootRouter";
import { errorMiddleware } from "./middlewares/errors";
import GeoIPService from "./utils/GeoIPService";

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

GeoIPService.init()
  .then(() => {
    console.log("GeoIPService Inittialized");
  })
  .catch((error) => {
    console.error("Error initializing GeoIPService:", error);
  });

function getClientIP(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"] as string;
  return forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "";
}

app.get("/location", async (req, res) => {
  const clientIP = getClientIP(req);

  try {
    const cityData = await GeoIPService.getCityData(clientIP);
    if (cityData) {
      res.json(cityData);
    } else {
      res.status(404).json({ error: "Location not found in database." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
