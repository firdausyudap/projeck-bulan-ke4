import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, sendPaginated } from "../utils/response";

export async function listMedia(req: Request, res: Response) {
  try {
    const { page, limit, type, search } = req.query as any;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { caption: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.media.findMany({ where, skip, take: limitNum, orderBy: { createdAt: "desc" } }),
      prisma.media.count({ where }),
    ]);

    return sendPaginated(res, items, { page: pageNum, limit: limitNum, total });
  } catch (err) {
    console.error("List media error:", err);
    return sendError(res, "Failed to fetch media", 500);
  }
}

export async function getMedia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const item = await prisma.media.findUnique({ where: { id } });
    if (!item) return sendError(res, "Media not found", 404);
    return sendSuccess(res, item);
  } catch (err) {
    console.error("Get media error:", err);
    return sendError(res, "Failed to fetch media", 500);
  }
}

export async function createMedia(req: Request, res: Response) {
  try {
    const data = req.body;
    const ownerCount = [data.articleId, data.kingId, data.inscriptionId].filter(Boolean).length;
    if (ownerCount > 1) {
      return sendError(res, "Media hanya dapat terhubung ke satu pemilik (artikel, raja, atau prasasti)", 400);
    }
    const item = await prisma.media.create({
      data: {
        title: data.title,
        url: data.url,
        type: data.type,
        altText: data.altText,
        caption: data.caption,
        credit: data.credit,
        source: data.source,
        license: data.license,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        width: data.width,
        height: data.height,
        duration: data.duration,
        isIllustration: data.isIllustration || false,
        articleId: data.articleId || null,
        kingId: data.kingId || null,
        inscriptionId: data.inscriptionId || null,
      },
    });
    return sendSuccess(res, item, "Media created", 201);
  } catch (err) {
    console.error("Create media error:", err);
    return sendError(res, "Failed to create media", 500);
  }
}

export async function updateMedia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Media not found", 404);

    const nextArticleId = data.articleId !== undefined ? (data.articleId || null) : existing.articleId;
    const nextKingId = data.kingId !== undefined ? (data.kingId || null) : existing.kingId;
    const nextInscriptionId = data.inscriptionId !== undefined ? (data.inscriptionId || null) : existing.inscriptionId;
    const ownerCount = [nextArticleId, nextKingId, nextInscriptionId].filter(Boolean).length;
    if (ownerCount > 1) {
      return sendError(res, "Media hanya dapat terhubung ke satu pemilik (artikel, raja, atau prasasti)", 400);
    }
    const item = await prisma.media.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        url: data.url ?? existing.url,
        type: data.type ?? existing.type,
        altText: data.altText !== undefined ? data.altText : existing.altText,
        caption: data.caption !== undefined ? data.caption : existing.caption,
        credit: data.credit !== undefined ? data.credit : existing.credit,
        source: data.source !== undefined ? data.source : existing.source,
        license: data.license !== undefined ? data.license : existing.license,
        fileSize: data.fileSize !== undefined ? data.fileSize : existing.fileSize,
        mimeType: data.mimeType !== undefined ? data.mimeType : existing.mimeType,
        width: data.width !== undefined ? data.width : existing.width,
        height: data.height !== undefined ? data.height : existing.height,
        duration: data.duration !== undefined ? data.duration : existing.duration,
        isIllustration: data.isIllustration !== undefined ? data.isIllustration : existing.isIllustration,
        articleId: data.articleId !== undefined ? (data.articleId || null) : existing.articleId,
        kingId: data.kingId !== undefined ? (data.kingId || null) : existing.kingId,
        inscriptionId: data.inscriptionId !== undefined ? (data.inscriptionId || null) : existing.inscriptionId,
      },
    });
    return sendSuccess(res, item, "Media updated");
  } catch (err) {
    console.error("Update media error:", err);
    return sendError(res, "Failed to update media", 500);
  }
}

export async function deleteMedia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Media not found", 404);

    await prisma.media.delete({ where: { id } });
    return sendSuccess(res, null, "Media deleted");
  } catch (err) {
    console.error("Delete media error:", err);
    return sendError(res, "Failed to delete media", 500);
  }
}
