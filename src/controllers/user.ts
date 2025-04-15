import { Request, NextFunction, Response } from "express";

import { prismaClient } from "../app.js";
import { UpdateNumberSchema } from "../schemas/uers.js";

export const updateNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  UpdateNumberSchema.parse(req.body);

  const { userId, number } = req.body;

  await prismaClient.user.update({
    where: { id: userId },
    data: {
      number,
    },
  });

  res.status(201).json("Number Updated Sucessfully");
};
