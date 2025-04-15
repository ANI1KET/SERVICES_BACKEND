import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app.js";

/* ------------------------------------------GET---------------------------------------- */
export const getPromotingDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = parseInt(req.query.limit as string);
  const offset = parseInt(req.query.offset as string);

  const listers = await prismaClient.user.findMany({
    where: {
      toPromote: true,
    },
    take: limit,
    skip: offset,
    select: {
      id: true,
      name: true,
      email: true,
      number: true,
      promoteRoomPrice: true,
    },
  });
  const listerIds = listers.map((lister) => lister.id);

  if (listerIds.length === 0) {
    return res.status(200).json({ listers: [], listerRooms: [] });
  }

  const listerRooms = await prismaClient.room.findMany({
    where: {
      isActive: true,
      listerId: {
        in: listerIds,
      },
    },
    take: limit,
    skip: offset,
    select: {
      id: true,
      name: true,
      city: true,
      price: true,
      location: true,
      listerId: true,
      direction: true,
      primaryContact: true,
      //   photos: true,
      //   roomtype: true,
      //   available: true,
      //   amenities: true,
      //   mincapacity: true,
      //   maxcapacity: true,
    },
  });

  res.status(200).json({ listers, listerRooms });
};

export const getListerRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listerId = req.query.listerId as string;
  const limit = parseInt(req.query.limit as string);
  const offset = parseInt(req.query.offset as string);

  const listerRooms = await prismaClient.room.findMany({
    where: {
      listerId,
      isActive: true,
    },
    take: limit,
    skip: offset,
    select: {
      id: true,
      name: true,
      city: true,
      price: true,
      location: true,
      listerId: true,
      direction: true,
      primaryContact: true,
      //   photos: true,
      //   roomtype: true,
      //   available: true,
      //   amenities: true,
      //   mincapacity: true,
      //   maxcapacity: true,
    },
  });

  res.status(200).json(listerRooms);
};

export const getPromoterDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  const promoter = await prismaClient.promoter.findUnique({
    where: { userId },
    include: {
      //   user: true,
      promotionDeals: {
        include: {
          lister: {
            select: {
              name: true,
              email: true,
              number: true,
            },
          },
          promotions: {
            include: {
              room: {
                select: {
                  name: true,
                  city: true,
                  location: true,
                  direction: true,
                },
              },
              clickEvents: {
                select: {
                  ip: true,
                  deviceType: true,
                  timestamp: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!promoter) {
    return res.status(404).json({ message: "Promoter not found." });
  }

  res.status(200).json(promoter);
};

/* -----------------------------------------POST---------------------------------------- */
export const shortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
