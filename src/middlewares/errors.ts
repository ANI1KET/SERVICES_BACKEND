import { NextFunction, Request, Response } from "express";

import { HttpException } from "../exceptions/errorhandler.js";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.errors,
    error: error.message,
    errorCode: error.errorCode,
  });
};
