import { getToken } from "next-auth/jwt";

import { Request, NextFunction, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/errorhandler";
import { JWT_TOKEN_SECRET } from "../env_variable";
import { prismaClient } from "../app";
import { User } from "@prisma/client";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const accessToken = req.headers["authorization"]?.split(" ")[1];
  // const refreshToken = req.cookies["next-auth.session-token"];

  // if (!accessToken)
  // return res.status(401).json({ message: "Access token is missing" });

  try {
    const decodedToken = await getToken({
      req,
      secret: JWT_TOKEN_SECRET,
    });

    if (!decodedToken) {
      return res.status(401).json({ message: "Please log in to continue" });
    }

    req.user = {
      id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
      number: decodedToken.number,
      role: decodedToken.role,
    } as User;

    // return next();
  } catch (e) {
    console.log(e);
    return new UnauthorizedException(
      "Unauthorized Excess",
      ErrorCode.UNAUTHORIZED
    );
  }
};

export default authMiddleware;
