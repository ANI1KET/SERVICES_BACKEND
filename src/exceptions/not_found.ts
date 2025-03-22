import { ErrorCode, HttpException } from "./errorhandler.js";

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, 404, null, errorCode);
  }
}
