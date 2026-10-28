import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { sendSuccess, sendError } from "../utils/response";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError(res, "Email already registered", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, role: "USER" },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { user, token }, "Registration successful", 201);
  } catch (err) {
    console.error("Register error:", err);
    return sendError(res, "Registration failed", 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return sendSuccess(res, { user: safeUser, token }, "Login successful");
  } catch (err) {
    console.error("Login error:", err);
    return sendError(res, "Login failed", 500);
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  return sendSuccess(res, null, "Logout successful");
}

export async function me(req: Request, res: Response) {
  try {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, bio: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, { user });
  } catch (err) {
    console.error("Me error:", err);
    return sendError(res, "Failed to fetch user", 500);
  }
}
export async function listUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return sendSuccess(res, users);
  } catch (err) {
    console.error("List users error:", err);
    return sendError(res, "Failed to fetch users", 500);
  }
}
