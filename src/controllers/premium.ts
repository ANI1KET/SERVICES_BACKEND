import { Permission } from "@prisma/client";
import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app.js";
import { upgradeUserSchema } from "../schemas/premium.js";

/* ------------------------------------------GET---------------------------------------- */

/* -----------------------------------------POST---------------------------------------- */
export const upgradeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upgradeUserSchema.parse(req.body);

  const { userId, permission, durationInDays, role } = req.body;

  const subscription = await prismaClient.subscription.findUnique({
    where: { userId: userId },
    select: { permissions: true },
  });

  const currentDate = new Date();
  const existingPermissions =
    (subscription?.permissions as Record<string, string>) || {};

  const currentExpiry = existingPermissions[permission]
    ? new Date(existingPermissions[permission])
    : currentDate;
  currentExpiry.setDate(currentExpiry.getDate() + durationInDays);

  const updatedPermissions = {
    ...existingPermissions,
    [permission]: currentExpiry.toISOString(),
  };

  const expiresAt = new Date(
    Math.min(
      ...Object.values(updatedPermissions).map((date) =>
        new Date(date as string).getTime()
      )
    )
  );

  await prismaClient.$transaction([
    prismaClient.subscription.upsert({
      where: { userId },
      update: {
        permissions: updatedPermissions,
        expiresAt: new Date(expiresAt),
      },
      create: {
        userId,
        permissions: updatedPermissions,
        expiresAt: new Date(expiresAt),
      },
    }),
    prismaClient.user.update({
      where: { id: userId },
      data: {
        permission: Object.keys(updatedPermissions) as Permission[],
        role: role,
      },
    }),
    ...(permission === "room"
      ? [
          prismaClient.room.updateMany({
            where: { userId },
            data: { isActive: true },
          }),
        ]
      : []),
    ...(permission === "store"
      ? [
          prismaClient.store.updateMany({
            where: { userId },
            data: { isActive: true },
          }),
        ]
      : []),
  ]);

  return res.json({
    success: true,
    message: "Subscription updated successfully.",
  });
};

/* ------------------------------------------PUT----------------------------------------- */

/* ----------------------------------------DELETE-----------------------------------------*/
