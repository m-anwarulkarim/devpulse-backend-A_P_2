import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any = err.message || "An unexpected error occurred";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.code === "23505") {
    // Unique violation 
    statusCode = 400;
    message = "Duplicate resource";
    errors = err.detail || "A record with this unique value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
