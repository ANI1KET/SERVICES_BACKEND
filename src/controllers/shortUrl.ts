import { nanoid } from "nanoid";
import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app.js";
import { urlValidation } from "../schemas/url.js";

/* ------------------------------------------GET---------------------------------------- */
export const redirectUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shortId = req.params.shortId;
  const { ip, deviceType } = req.body;

  const roomPromotion = await prismaClient.roomPromotion.findUnique({
    where: {
      shortUrl: shortId,
    },
  });

  if (!roomPromotion) {
    return res.status(404).json({ message: "Not found." });
  }

  if (roomPromotion.expiresAt <= new Date()) {
    return res.status(410).json({ message: "This link has expired." });
  }

  await Promise.all([
    prismaClient.roomPromotion.update({
      where: { id: roomPromotion.id },
      data: {
        clicks: { increment: 1 },
        totalPrice: { increment: roomPromotion.pricePerClick },
      },
    }),
    prismaClient.userClick.create({
      data: {
        ip,
        deviceType,
        roomPromotion: {
          connect: { id: roomPromotion?.id },
        },
      },
    }),
  ]);

  return res.redirect(roomPromotion?.originalUrl);
};

/* -----------------------------------------POST---------------------------------------- */
export const shortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  urlValidation.parse(req.body);

  const { userId, listerId, roomId, url, pricePerClick } = req.body;
  const shortId = nanoid(8);
  const now = new Date();
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const promoter = await prismaClient.promoter.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const promotionAgreement = await prismaClient.promotionAgreement.upsert({
    where: {
      promoterId_listerId: {
        promoterId: promoter.id,
        listerId: listerId,
      },
    },
    update: {},
    create: {
      promoter: { connect: { id: promoter.id } },
      lister: { connect: { id: listerId } },
    },
  });

  const existingRoomPromo = await prismaClient.roomPromotion.findFirst({
    where: {
      originalUrl: url,
      agreementId: promotionAgreement.id,
    },
  });

  let roomPromotion;
  if (existingRoomPromo) {
    if (existingRoomPromo.expiresAt < now) {
      roomPromotion = await prismaClient.roomPromotion.update({
        where: { id: existingRoomPromo.id },
        data: { expiresAt: newExpiresAt },
      });
    } else {
      roomPromotion = existingRoomPromo;
    }
  } else {
    roomPromotion = await prismaClient.roomPromotion.create({
      data: {
        originalUrl: url,
        shortUrl: shortId,
        expiresAt: newExpiresAt,
        pricePerClick: pricePerClick,
        room: { connect: { id: roomId } },
        agreement: { connect: { id: promotionAgreement.id } },
      },
    });
  }

  res.status(201).json({ message: "ShortLink Created Sucessfully" });
};
