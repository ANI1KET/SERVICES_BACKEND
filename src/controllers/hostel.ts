import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app.js";
import { ReviewSchema } from "../schemas/room.js";
import { ErrorCode } from "../exceptions/errorhandler.js";
import { BadRequestsException } from "../exceptions/bad_requests.js";

/* ------------------------------------------GET---------------------------------------- */
export const allhostelDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};

export const hostelDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const roomId = req.params.roomId;
  //   const roomData = await prismaClient.hostel.findFirst({
  //     where: {
  //       id: roomId,
  //     },
  //     include: {
  //       storeReviews: true,
  //       // user: true,
  //       user: {
  //         select: {
  //           role: true,
  //         },
  //       },
  //     },
  //   });
  //   res.status(200).json(roomData);
};

/* -----------------------------------------POST---------------------------------------- */
export const createHostel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const {
  //     name,
  //     city,
  //     roomNumber,
  //     location,
  //     photos,
  //     videos,
  //     price,
  //     mincapacity,
  //     maxcapacity,
  //     roomtype,
  //     furnishingStatus,
  //     userId,
  //   } = req.body;
  //   // Create the room in the database
  //   const newRoom = await prismaClient.room.create({
  //     data: {
  //       name,
  //       city,
  //       roomNumber,
  //       location,
  //       photos,
  //       videos,
  //       price,
  //       mincapacity,
  //       maxcapacity,
  //       roomtype,
  //       furnishingStatus,
  //       userId,
  //     },
  //   });
  //   // Respond with the created room data
  //   res.status(201).json({
  //     success: true,
  //     data: newRoom,
  //   });
};

export const reviewHostel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   ReviewSchema.parse(req.body);
  //   const { rating, comment, roomId, userId } = req.body;
  //   const newReview = await prismaClient.$transaction(async (prisma) => {
  //     // Step 1: Create a new review
  //     const review = await prisma.roomReview.create({
  //       data: {
  //         rating,
  //         comment,
  //         user: { connect: { id: userId } },
  //         room: { connect: { id: roomId } },
  //       },
  //     });
  //     // Step 2: Calculate the new average rating for the room
  //     const { _avg } = await prisma.roomReview.aggregate({
  //       where: { roomId },
  //       _avg: { rating: true },
  //     });
  //     // Step 3: Update the `ratings` field in the `RoomForRent` model
  //     if (_avg.rating !== null) {
  //       await prisma.room.update({
  //         where: { id: roomId },
  //         data: { ratings: _avg.rating }, // Set the average rating
  //       });
  //     }
  //     return review; // Return the newly created review
  //   });
  //   res.status(201).json(newReview);
};

/* ------------------------------------------PUT----------------------------------------- */
export const updatehostelDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};

/* ----------------------------------------DELETE-----------------------------------------*/
export const deletehostel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { roomId } = req.params;
  console.log(req.params);
};
