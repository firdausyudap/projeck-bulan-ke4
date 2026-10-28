import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, sendPaginated } from "../utils/response";

function toSlug(text: string): string {
  return text.toLowerCase().trim().replace(/[^\\w\\s-]/g, "").replace(/[\\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function listKings(req: Request, res: Response) {
  try {
    const { page, limit, search } = req.query as any;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [kings, total] = await Promise.all([
      prisma.king.findMany({ where, skip, take: limitNum, orderBy: { createdAt: "desc" }, include: { media: true } }),
      prisma.king.count({ where }),
    ]);

    return sendPaginated(res, kings, { page: pageNum, limit: limitNum, total });
  } catch (err) {
    console.error("List kings error:", err);
    return sendError(res, "Failed to fetch kings", 500);
  }
}

export async function getKing(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const king = await prisma.king.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        media: true,
        relationsFrom: { include: { toKing: true } },
        relationsTo: { include: { fromKing: true } },
      },
    });

    if (!king) return sendError(res, "King not found", 404);
    return sendSuccess(res, king);
  } catch (err) {
    console.error("Get king error:", err);
    return sendError(res, "Failed to fetch king", 500);
  }
}

export async function createKing(req: Request, res: Response) {
  try {
    const data = req.body;
    const finalSlug = data.slug ? toSlug(data.slug) : toSlug(data.name);

    const existing = await prisma.king.findUnique({ where: { slug: finalSlug } });
    if (existing) return sendError(res, "A king with this slug already exists", 409);

    const king = await prisma.king.create({
      data: {
        name: data.name,
        title: data.title,
        slug: finalSlug,
        reignStart: data.reignStart,
        reignEnd: data.reignEnd,
        birthYear: data.birthYear,
        deathYear: data.deathYear,
        birthPlace: data.birthPlace,
        deathPlace: data.deathPlace,
        description: data.description,
        biography: data.biography,
        achievements: data.achievements,
        verificationStatus: data.verificationStatus || "NEEDS_RESEARCH",
        sourceNote: data.sourceNote,
        portraitUrl: data.portraitUrl || null,
      },
    });

    return sendSuccess(res, king, "King created", 201);
  } catch (err) {
    console.error("Create king error:", err);
    return sendError(res, "Failed to create king", 500);
  }
}

export async function updateKing(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.king.findUnique({ where: { id } });
    if (!existing) return sendError(res, "King not found", 404);

    const finalSlug = data.slug ? toSlug(data.slug) : existing.slug;
    if (finalSlug !== existing.slug) {
      const slugExists = await prisma.king.findUnique({ where: { slug: finalSlug } });
      if (slugExists) return sendError(res, "A king with this slug already exists", 409);
    }

    const king = await prisma.king.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        title: data.title !== undefined ? data.title : existing.title,
        slug: finalSlug,
        reignStart: data.reignStart !== undefined ? data.reignStart : existing.reignStart,
        reignEnd: data.reignEnd !== undefined ? data.reignEnd : existing.reignEnd,
        birthYear: data.birthYear !== undefined ? data.birthYear : existing.birthYear,
        deathYear: data.deathYear !== undefined ? data.deathYear : existing.deathYear,
        birthPlace: data.birthPlace !== undefined ? data.birthPlace : existing.birthPlace,
        deathPlace: data.deathPlace !== undefined ? data.deathPlace : existing.deathPlace,
        description: data.description ?? existing.description,
        biography: data.biography !== undefined ? data.biography : existing.biography,
        achievements: data.achievements !== undefined ? data.achievements : existing.achievements,
        verificationStatus: data.verificationStatus ?? existing.verificationStatus,
        sourceNote: data.sourceNote !== undefined ? data.sourceNote : existing.sourceNote,
        portraitUrl: data.portraitUrl !== undefined ? (data.portraitUrl || null) : existing.portraitUrl,
      },
    });

    return sendSuccess(res, king, "King updated");
  } catch (err) {
    console.error("Update king error:", err);
    return sendError(res, "Failed to update king", 500);
  }
}

export async function deleteKing(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.king.findUnique({ where: { id } });
    if (!existing) return sendError(res, "King not found", 404);

    await prisma.king.delete({ where: { id } });
    return sendSuccess(res, null, "King deleted");
  } catch (err) {
    console.error("Delete king error:", err);
    return sendError(res, "Failed to delete king", 500);
  }
}
