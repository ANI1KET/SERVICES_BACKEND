import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app.js";
import { InterestedRoomsSchema } from "../schemas/savedRooms.js";

/* ------------------------------------------GET---------------------------------------- */
export const getInterestedRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listerId } = req.body;

  const interestedRooms = await prismaClient.interestedRooms.findMany({
    where: {
      listerId,
    },
    select: {
      roomId: true,
      room: {
        select: {
          city: true,
          name: true,
          location: true,
        },
      },
      interestedBy: {
        select: {
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
              number: true,
            },
          },
        },
      },
    },
    // include: {
    //   room: {
    //     select: {
    //       city: true,
    //       name: true,
    //       location: true,
    //     },
    //   },
    //   interestedBy: {
    //     include: {
    //       user: {
    //         select: {
    //           name: true,
    //           email: true,
    //           number: true,
    //         },
    //       },
    //     },
    //   },
    // },
  });

  res.status(201).json(interestedRooms);
};

/* -----------------------------------------POST---------------------------------------- */
export const createInterestedRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  InterestedRoomsSchema.parse(req.body);

  const { userId, roomId, listerId } = req.body;

  await prismaClient.interestedRooms.upsert({
    where: { roomId },
    update: {
      interestedBy: {
        create: { userId },
      },
    },
    create: {
      roomId,
      listerId,
      interestedBy: {
        create: { userId },
      },
    },
  });

  // await prismaClient.$transaction(async (tx) => {
  //   const savedRoom = await tx.interestedRooms.upsert({
  //     where: { roomId },
  //     update: {},
  //     create: {
  //       roomId,
  //       listerId,
  //     },
  //   });

  //   await tx.interestedRoomsUsers.upsert({
  //     where: {
  //       userId_savedRoomId: {
  //         userId,
  //         savedRoomId: savedRoom.id,
  //       },
  //     },
  //     update: {},
  //     create: {
  //       userId,
  //       savedRoomId: savedRoom.id,
  //     },
  //   });
  // });

  res.status(201).json({
    success: true,
  });
};

/* ------------------------------------------PUT----------------------------------------- */

/* ----------------------------------------DELETE-----------------------------------------*/
export const deleteInterestedRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { roomId } = req.body;

  await prismaClient.interestedRooms.delete({
    where: {
      roomId,
    },
  });

  res.status(201).json({
    message: "success",
  });
};
