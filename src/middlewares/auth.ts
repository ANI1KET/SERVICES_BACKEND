import { getToken } from "next-auth/jwt";

import { Request, NextFunction, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/errorhandler";
import {
  ACCESS_TOKEN_JWT_SECRET,
  REFRESH_TOKEN_JWT_SECRET,
} from "../env_variable";
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
      secret: REFRESH_TOKEN_JWT_SECRET,
    });
    res.json({});

    if (!decodedToken) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = {
      id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
      number: decodedToken.number,
      role: decodedToken.role,
    } as User;

    return next();
  } catch (e) {
    console.log(e);
  }

  // try {
  // const decoded = jwt.verify(accessToken, ACCESS_TOKEN_JWT_SECRET) as any;
  // console.log("2 ", decoded);
  // const decodedToken = jwt.decode(refreshToken, { complete: true });
  // const decoded1 = jwt.verify(refreshToken, REFRESH_TOKEN_JWT_SECRET);
  // console.log("3 ", decoded1);

  //   const user = await prismaClient.user.findFirst({
  //     where: { id: decoded.userId },
  //   });

  //   if (!user)
  //     return next(
  //       new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
  //     );

  // } catch (err) {
  //   // Handle different error cases based on token verification result
  //   if (err.name === "TokenExpiredError") {
  //     // Access token has expired, check if refresh token is available
  //     if (!refreshToken)
  //       return res.status(401).json({ message: "Please login" });

  //     try {
  //       // Verify refresh token
  //       const decodedRefresh = jwt.verify(refreshToken, REFRESH_JWT_SECRET);

  //       // Generate new access and refresh tokens
  //       const newAccessToken = jwt.sign(
  //         { userId: decodedRefresh.userId },
  //         ACCESS_JWT_SECRET,
  //         { expiresIn: "15m" }
  //       );

  //       const newRefreshToken = jwt.sign(
  //         { userId: decodedRefresh.userId },
  //         REFRESH_JWT_SECRET,
  //         { expiresIn: "1d" }
  //       );

  //       // Set the new refresh token in HttpOnly cookie
  //       res.cookie("refreshToken", newRefreshToken, {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === "production",
  //         maxAge: 24 * 60 * 60 * 1000,
  //         sameSite: "strict",
  //       });

  //       req.user = { userId: decodedRefresh.userId };
  //       res.setHeader("Authorization", `Bearer ${newAccessToken}`);
  //       return next();
  //     } catch (refreshError) {
  //       // If refresh token is invalid or expired
  //       return res.status(403).json({ message: "Please login" });
  //     }
  //   } else if (err.name === "JsonWebTokenError") {
  //     // Token is malformed or invalid
  //     return res.status(403).json({ message: "Access token is not valid" });
  //   } else {
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  // // const accessToken = req.headers.authorization as string;

  // // if (!accessToken) {
  // //   const refreshToken = req.headers.authorization as string;

  // //   if (!refreshToken) {
  // //     return next(
  // //       new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
  // //     );
  // //   }
  // // }

  // // try {
  // //   const payload = jwt.verify(accessToken, ACCESS_JWT_SECRET) as any;

  // //   const user = await prismaClient.user.findFirst({
  // //     where: { id: payload.userId },
  // //   });

  // //   if (!user)
  // //     return next(
  // //       new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
  // //     );

  // //   req.user = user;
  // //   next();
  // // } catch (error) {
  // //   next(
  // //     new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
  // //   );
  // // }
};

export default authMiddleware;
