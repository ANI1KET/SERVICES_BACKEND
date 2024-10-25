import { Request, NextFunction, Response } from "express";
import { prismaClient } from "../server";
import { BadRequestsException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/errorhandler";
import { ReviewSchema } from "../schemas/room";

// GET
export const allRoomDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};

export const roomDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};

// POST
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);

  const {
    name,
    city,
    location,
    photos,
    videos,
    price,
    mincapacity,
    maxcapacity,
    roomtype,
    verified,
    furnishingStatus,
    aminities,
  } = req.body;

  // Create the room in the database
  const newRoom = await prismaClient.roomForRent.create({
    data: {
      name,
      city,
      location,
      photos,
      videos,
      price,
      mincapacity,
      maxcapacity,
      roomtype,
      verified,
      furnishingStatus,
      aminities,
    },
  });

  // Respond with the created room data
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

  const { rating, comment, roomForRentId, userId } = req.body;

  const newReview = await prismaClient.$transaction(async (prisma) => {
    // Step 1: Create a new review
    const review = await prisma.roomReview.create({
      data: {
        rating,
        comment,
        user: { connect: { id: userId } },
        roomForRent: { connect: { id: roomForRentId } },
      },
    });

    // Step 2: Calculate the new average rating for the room
    const { _avg } = await prisma.roomReview.aggregate({
      where: { roomForRentId },
      _avg: { rating: true },
    });

    // Step 3: Update the `ratings` field in the `RoomForRent` model
    if (_avg.rating !== null) {
      await prisma.roomForRent.update({
        where: { id: roomForRentId },
        data: { ratings: _avg.rating }, // Set the average rating
      });
    }

    return review; // Return the newly created review
  });

  res.status(201).json(newReview);
};

// PUT
export const updateRoomDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};

// DELETE
export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};
