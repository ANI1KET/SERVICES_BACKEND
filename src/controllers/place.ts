import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app.js";
import { categorySchema, citySchema } from "../schemas/location.js";

// function getClientIP(req: Request): string {
//   const forwarded = req.headers["x-forwarded-for"] as string;
//   return forwarded
//     ? forwarded.split(",")[0].trim()
//     : req.socket.remoteAddress || "";
// }

const models = [
  "room",
  "store",
  "hostel",
  "restaurant",
  "land",
  "repair",
  "rental",
] as const;
type ModelName = (typeof models)[number];

/* ------------------------------------------GET---------------------------------------- */
export const citiesLocation = async (req: Request, res: Response) => {
  // const clientIP = getClientIP(req);
  // console.log(clientIP);

  const city = "Kathmandu";

  // if (country && country !== "Nepal") {
  //   return res
  //     .status(403)
  //     .json({ error: "Service is not available in your country." });
  // }

  const results = await Promise.all(
    models.map(async (model) => {
      const [cities, cityLocations] = await Promise.all([
        (prismaClient[model as ModelName] as { findMany: Function }).findMany({
          select: { city: true, isActive: true },
          distinct: ["city"],
        }),
        (prismaClient[model as ModelName] as { findMany: Function }).findMany({
          where: { city: city, isActive: true },
          select: { location: true },
        }),
      ]);

      const cityData = cities.reduce(
        (acc: Record<string, string[]>, { city }: { city: string }) => {
          acc[city] = [];
          return acc;
        },
        {}
      );

      if (city in cityData) {
        cityData[city] = cityLocations.map(
          ({ location }: { location: string }) => location
        );
      }

      return {
        [model]: cityData,
      };
    })
  );
  const transformedResult = results.reduce(
    (acc, curr) => ({ ...acc, ...curr }),
    {}
  );

  res.status(200).json({ city: city, ...transformedResult });
};

export const cityLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = categorySchema.parse(req.query.category);
  const city = citySchema.parse(req.query.city);

  const citiesLocation = await (
    prismaClient[category as ModelName] as { findMany: Function }
  ).findMany({
    where: { city, isActive: true },
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
  const filters = req.query.filters;

  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  // const filterQuery = {
  //   city,
  //   ...(locations && {
  //     OR: locations as string[]).map((location) => ({
  //       location: {
  //         equals: location,
  //       },
  //     })),
  //   }),
  // };
  const filterQuery = {
    city,
    isActive: true,
    ...(locations && {
      location: { in: locations as string[] },
      // location: { in: JSON.parse(locations as string) as string[] },
    }),
    ...buildFilters(filters),
  };

  const cityLocation = await (
    prismaClient[category as ModelName] as { findMany: Function }
  ).findMany({
    where: filterQuery,
    // include: {
    // user: {
    //   select: {
    //     role: true,
    //   },
    // },
    // roomReviews: {
    //   include: {
    //     user: {
    //       select: {
    //         name: true,
    //         email: true,
    //         image: true,
    //       },
    //     },
    //   },
    // },
    // },
    take: limit,
    skip: offset,
  });

  res.status(200).json(cityLocation);
};

const buildFilters = (filters: any) => {
  if (!filters) return {};

  const filterMap: Record<string, any> = {
    price: ([min, max]: [string, string]) => ({
      price: { gte: parseFloat(min), lte: parseFloat(max) },
    }),
    rating: ([min, max]: [string, string]) => ({
      ratings: { gte: parseFloat(min), lte: parseFloat(max) },
    }),
    capacity: ([min, max]: [string, string]) => ({
      OR: [
        {
          mincapacity: { lte: parseInt(max, 10) },
          maxcapacity: { gte: parseInt(min, 10) },
        },
      ],
    }),
    verified: (value: string) => ({ verified: value === "true" }),
    postedby: (value: string[]) => ({ postedBy: { in: value } }),
    roomtype: (value: string[]) => ({ roomtype: { in: value } }),
    amenities: (value: string[]) => ({ amenities: { hasSome: value } }),
    furnishingstatus: (value: string[]) => ({
      furnishingStatus: { in: value },
    }),
  };

  return Object.entries(filters).reduce((acc, [key, value]) => {
    // if (
    //   value === undefined ||
    //   value === null ||
    //   (Array.isArray(value) && value.length === 0)
    // ) {
    //   return acc;
    // }

    if (filterMap[key]) {
      Object.assign(acc, filterMap[key](value));
    }
    return acc;
  }, {});
};
/* ------------------------------------------POST---------------------------------------- */
/* ------------------------------------------PUT----------------------------------------- */
/* -----------------------------------------DELETE---------------------------------------- */
