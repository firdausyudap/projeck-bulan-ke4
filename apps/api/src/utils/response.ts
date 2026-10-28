import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200, meta?: ApiResponse["meta"]) {
  const response: ApiResponse<T> = { success: true, data, message };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 400, error?: string) {
  const response: ApiResponse = { success: false, message, error };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(res: Response, data: T[], meta: { page: number; limit: number; total: number }) {
  const totalPages = Math.ceil(meta.total / meta.limit);
  return sendSuccess(res, data, undefined, 200, {
    page: meta.page,
    limit: meta.limit,
    total: meta.total,
    totalPages,
  });
}
