import { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

import { BadRequestsException } from "../exceptions/bad_requests";
import { InternalException } from "../exceptions/internal_exception";
import { ErrorCode, HttpException } from "../exceptions/errorhandler";

export const errorHandler = (func: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) exception = error;
      else if (error instanceof ZodError)
        exception = new BadRequestsException(
          "Unprocessable Entity",
          ErrorCode.UNPROCESSABLE_ENTITY,
          error.errors[0].message
        );
      else {
        exception = new InternalException(
          "Something went wrong!",
          error.message,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }
      next(exception);
    }
  };
};
