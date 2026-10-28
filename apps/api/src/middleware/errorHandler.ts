import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export class AppError extends Error {
  constructor(public statusCode: number, message: string, public details?: string) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as any;
    if (prismaErr.code === "P2002") {
      return sendError(res, "A record with this value already exists", 409);
    }
    if (prismaErr.code === "P2025") {
      return sendError(res, "Record not found", 404);
    }
  }

  const statusCode = 500;
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;
  return sendError(res, message, statusCode);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Route ${req.method} ${req.path} not found`, 404);
}
