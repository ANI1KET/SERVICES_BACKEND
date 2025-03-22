import { ErrorCode, HttpException } from "./errorhandler.js";

export class InternalException extends HttpException {
  constructor(message: string, errors: any, errorCode: ErrorCode) {
    super(message, 500, errors, errorCode);
  }
}
