import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app";
import { ReviewSchema } from "../schemas/room";
import { ErrorCode } from "../exceptions/errorhandler";
import { BadRequestsException } from "../exceptions/bad_requests";

/* ------------------------------------------GET---------------------------------------- */
export const allRoomDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const city = req.query.city as string;

  const categoryDetails = await prismaClient.room.findMany({
    where: {
      city: city,
    },
    // include: {
    // user: {
    //   select: {
    //     role: true,
    //   },
    // },
    //   roomReviews: {
    //     include: {
    //       user: {
    //         select: {
    //           name: true,
    //           email: true,
    //           image: true,
    //         },
    //       },
    //     },
    //   },
    // },
    take: limit,
    skip: offset,
  });

  res.status(200).json(categoryDetails);
};

export const roomDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roomId = req.params.roomId;

  const roomData = await prismaClient.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      reviews: true,
      // user: true,
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  res.status(200).json(roomData);
};

/* -----------------------------------------POST---------------------------------------- */
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    city,
    hall,
    price,
    photos,
    userId,
    videos,
    bedroom,
    kitchen,
    bathroom,
    location,
    roomtype,
    mincapacity,
    maxcapacity,
    ownerContact,
    primaryContact,
    furnishingStatus,
  } = req.body;

  const newRoom = await prismaClient.room.create({
    data: {
      name,
      city,
      hall,
      price,
      photos,
      userId,
      videos,
      bedroom,
      kitchen,
      bathroom,
      location,
      roomtype,
      mincapacity,
      maxcapacity,
      ownerContact,
      primaryContact,
      furnishingStatus,
      user: {
        connect: { id: userId },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: newRoom,
  });
};

export const bookRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};

export const reviewRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ReviewSchema.parse(req.body);

  const { rating, comment, roomId, userId } = req.body;

  const newReview = await prismaClient.$transaction(async (prisma) => {
    // Step 1: Create a new review
    const review = await prisma.roomReview.create({
      data: {
        rating,
        comment,
        user: { connect: { id: userId } },
        room: { connect: { id: roomId } },
      },
    });

    // Step 2: Calculate the new average rating for the room
    const { _avg } = await prisma.roomReview.aggregate({
      where: { roomId },
      _avg: { rating: true },
    });

    // Step 3: Update the `ratings` field in the `RoomForRent` model
    if (_avg.rating !== null) {
      await prisma.room.update({
        where: { id: roomId },
        data: { ratings: _avg.rating }, // Set the average rating
      });
    }

    return review;
  });

  res.status(201).json(newReview);
};

/* ------------------------------------------PUT----------------------------------------- */
export const updateRoomDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};

/* ----------------------------------------DELETE-----------------------------------------*/
export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};
