import { Request, NextFunction, Response } from "express";

import { ErrorCode } from "../exceptions/errorhandler.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  if (user.role === "ADMIN") next();
  else
    next(
      new UnauthorizedException("Unauthorized Excess", ErrorCode.UNAUTHORIZED)
    );
};

export default adminMiddleware;
