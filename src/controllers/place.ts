import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app";
import GeoIPService from "../utils/GeoIPService";
import { categorySchema, citySchema } from "../schemas/location";

GeoIPService.init()
  .then(() => {
    console.log("GeoIPService Inittialized");
  })
  .catch((error) => {
    console.error("Error initializing GeoIPService:", error);
  });

function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"] as string;
  return forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "";
}

function removeDiacritics(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type ModelName =
  | "room"
  | "store"
  | "hostel"
  | "restaurant"
  | "land"
  | "repair"
  | "rental";

/* ------------------------------------------GET---------------------------------------- */
// export const location = async (req: Request, res: Response) => {
//     // let category: ModelName = "room";
//     let category = "room";
//     const clientIP = getClientIP(req);
//     try {
//       if (req.query.category) {
//         category = categorySchema.parse(req.query.category);
//       }

//       // const cityData = await GeoIPService.getCityData(clientIP);
//       // const cityData = await GeoIPService.getCityData("113.199.136.160"); // Ilam
//       // const cityData = await GeoIPService.getCityData("124.41.204.21"); // Kathmandu
//       // const cityData = await GeoIPService.getCityData("113.199.238.102"); // Dharan
//       const cityData = await GeoIPService.getCityData("27.34.104.213"); // Pokhara
//       const country = cityData?.country?.names.en;
//       const city = cityData?.city?.names.en
//         ? removeDiacritics(cityData.city.names.en)
//         : undefined;

//       if (country !== "Nepal" && country !== undefined) {
//         throw new Error("Service is not available in your country.");
//       }

//       if (!city) {
//         const cities = await prismaClient[category as ModelName].findMany({
//           select: { city: true },
//           distinct: ["city"],
//         });

//         return res.status(200).json({ city: "", cities, cityLocations: [] });
//       }

//       // const [roomcitiesData, roomCityLocationsData] = await Promise.all([
//       const [cities, cityLocations] = await Promise.all([
//         prismaClient[category as ModelName].findMany({
//           select: { city: true },
//           distinct: ["city"],
//         }),
//         prismaClient[category as ModelName].findMany({
//           where: { city },
//           select: { location: true },
//         }),
//       ]);

//       // const cities = citiesData.map((item) => item.city);
//       // const cityLocations = cityLocationsData.map(
//       //   (item) => item.location
//       // );

//       res.status(200).json({ city, cities, cityLocations });
//     } catch (error: any) {
//       const errorMessage =
//         error instanceof z.ZodError ? error.errors[0].message : error.message;
//       res.status(500).json({ error: errorMessage });
//     }
//   };
export const citiesLocation = async (req: Request, res: Response) => {
  let category: ModelName = "room";
  const clientIP = getClientIP(req);
  if (req.query.category) {
    category = categorySchema.parse(req.query.category);
  }

  // const cityData = await GeoIPService.getCityData(clientIP);
  // const cityData = await GeoIPService.getCityData("113.199.136.160"); // Ilam
  //   const cityData = await GeoIPService.getCityData("124.41.204.21"); // Kathmandu
  //   const cityData = await GeoIPService.getCityData("113.199.238.102"); // Dharan
  const cityData = await GeoIPService.getCityData("27.34.104.213"); // Pokhara
  const country = cityData?.country?.names.en;
  const city = cityData?.city?.names.en
    ? removeDiacritics(cityData.city.names.en)
    : undefined;

  if (country && country !== "Nepal") {
    return res
      .status(403)
      .json({ error: "Service is not available in your country." });
  }

  if (!city) {
    const cities = await (
      prismaClient[category] as { findMany: Function }
    ).findMany({
      select: { city: true },
      distinct: ["city"],
    });

    return res.status(200).json({ city: "", cities, cityLocations: [] });
  }

  const [cities, cityLocations] = await Promise.all([
    (prismaClient[category] as { findMany: Function }).findMany({
      select: { city: true },
      distinct: ["city"],
    }),
    (prismaClient[category] as { findMany: Function }).findMany({
      where: { city },
      select: { location: true },
    }),
  ]);

  res.status(200).json({ city, cities, cityLocations });
};

export const cityLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category, city } = req.query;

  categorySchema.parse(category);
  citySchema.parse(city);

  const citiesLocation = await (
    prismaClient[category as ModelName] as { findMany: Function }
  ).findMany({
    where: { city },
    select: { location: true },
  });

  res.status(200).json(citiesLocation);
};

export const cityLocationsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = categorySchema.parse(req.path.replace(/^\/+/, ""));
  const city = citySchema.parse(req.query.city);
  const locations = req.query.locations ? req.query.locations : undefined;

  // const filters = {
  //   city,
  //   ...(locations && {
  //     OR: (JSON.parse(locations as string) as string[]).map((location) => ({
  //       location: {
  //         equals: location,
  //       },
  //     })),
  //   }),
  // };
  const filters = {
    city,
    ...(locations && {
      location: { in: JSON.parse(locations as string) as string[] },
    }),
  };

  const cityLocation = await (
    prismaClient[category as ModelName] as { findMany: Function }
  ).findMany({
    where: filters,
  });

  res.status(200).json(cityLocation);
};
/* ------------------------------------------POST---------------------------------------- */
/* ------------------------------------------PUT----------------------------------------- */
/* -----------------------------------------DELETE---------------------------------------- */
