import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { prisma } from "../utils/prisma";
import { sendError } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string };
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return sendError(res, "Authentication required", 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return sendError(res, "Invalid or expired token", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    return sendError(res, "User not found", 401);
  }

  req.user = { ...payload, id: payload.userId };
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "ADMIN") {
    return sendError(res, "Admin access required", 403);
  }
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = { ...payload, id: payload.userId };
    }
  }
  next();
}
