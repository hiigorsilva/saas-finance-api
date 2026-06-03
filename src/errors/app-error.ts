import { type ErrorCode, ErrorCodes } from './error-codes'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: ErrorCode

  constructor(
    message: string,
    statusCode = 400,
    code: ErrorCode = ErrorCodes.UNKNOWN_ERROR
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}

export { ErrorCodes }
