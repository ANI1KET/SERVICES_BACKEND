import z from "zod";
import express, { Request, Response } from "express";

import { prismaClient } from "../app";
import GeoIPService from "./GeoIPService";
import { categorySchema } from "../schemas/location";

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

function removeDiacritics(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// type ModelName = "room" | "store" | "hostel" | "restaurant" | "land" | "book" | "car";
type ModelName = "room";

export const Location = async (req: Request, res: Response) => {
  // let category: ModelName = "room";
  let category = "room";
  const clientIP = getClientIP(req);
  try {
    if (req.query.category) {
      category = categorySchema.parse(req.query.category);
    }

    // const cityData = await GeoIPService.getCityData(clientIP);
    const cityData = await GeoIPService.getCityData("113.199.136.160");
    const country = cityData?.country?.names.en;
    const city = cityData?.city?.names.en
      ? removeDiacritics(cityData.city.names.en)
      : undefined;

    if (country !== "Nepal" && country !== undefined) {
      throw new Error("Service is not available in your country.");
    }

    if (!city) {
      throw new Error("City information is not available.");
    }

    // const [roomcitiesData, roomCityLocationsData] = await Promise.all([
    const [roomcities, roomCityLocations] = await Promise.all([
      prismaClient[category as ModelName].findMany({ select: { city: true } }),
      prismaClient[category as ModelName].findMany({
        where: { city },
        select: { location: true },
      }),
    ]);

    // const roomcities = roomcitiesData.map((item) => item.city);
    // const roomCityLocations = roomCityLocationsData.map(
    //   (item) => item.location
    // );

    res.status(200).json({ city, roomcities, roomCityLocations });
  } catch (error: any) {
    const errorMessage =
      error instanceof z.ZodError ? error.errors[0].message : error.message;
    res.status(500).json({ error: errorMessage });
  }
};
