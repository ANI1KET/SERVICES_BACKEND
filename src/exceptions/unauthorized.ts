import { ErrorCode, HttpException } from "./errorhandler.js";

export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: unknown) {
    super(message, 401, errors, errorCode);
  }
}
