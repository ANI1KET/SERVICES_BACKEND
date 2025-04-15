import { User } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { Request, NextFunction, Response } from "express";

import { ErrorCode } from "../exceptions/errorhandler.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

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
    });

    if (!decodedToken) {
      return res.status(401).json({ message: "Please log in to continue" });
    }

    req.user = {
      id: decodedToken.sub,
      name: decodedToken.name,
      role: decodedToken.role,
      email: decodedToken.email,
      number: decodedToken.number,
    } as User;

    return next();
  } catch (e) {
    console.log(e);
    return new UnauthorizedException(
      "Unauthorized Excess",
      ErrorCode.UNAUTHORIZED
    );
  }
};

export default authMiddleware;
