import * as jwt from "jsonwebtoken";

import { Request, NextFunction, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/errorhandler";
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../env_variable";
import { prismaClient } from "../server";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization as string;

  if (!token) {
    return next(
      new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
    );
  }

  try {
    const payload = jwt.verify(token, ACCESS_JWT_SECRET) as any;

    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user)
      return next(
        new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
      );

    req.user = user;
    next();
  } catch (error) {
    next(
      new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
    );
  }
};

export default authMiddleware;
