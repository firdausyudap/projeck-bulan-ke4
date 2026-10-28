import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, sendPaginated } from "../utils/response";

function toSlug(text: string): string {
  return text.toLowerCase().trim().replace(/[^\\w\\s-]/g, "").replace(/[\\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function listInscriptions(req: Request, res: Response) {
  try {
    const { page, limit, search, category } = req.query as any;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }

    const [items, total] = await Promise.all([
      prisma.inscription.findMany({ where, skip, take: limitNum, orderBy: { createdAt: "desc" }, include: { category: true, media: true } }),
      prisma.inscription.count({ where }),
    ]);

    return sendPaginated(res, items, { page: pageNum, limit: limitNum, total });
  } catch (err) {
    console.error("List inscriptions error:", err);
    return sendError(res, "Failed to fetch inscriptions", 500);
  }
}

export async function getInscription(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const item = await prisma.inscription.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { category: true, media: true },
    });
    if (!item) return sendError(res, "Inscription not found", 404);
    return sendSuccess(res, item);
  } catch (err) {
    console.error("Get inscription error:", err);
    return sendError(res, "Failed to fetch inscription", 500);
  }
}

export async function createInscription(req: Request, res: Response) {
  try {
    const data = req.body;
    const finalSlug = data.slug ? toSlug(data.slug) : toSlug(data.name);

    const existing = await prisma.inscription.findUnique({ where: { slug: finalSlug } });
    if (existing) return sendError(res, "An inscription with this slug already exists", 409);

    const item = await prisma.inscription.create({
      data: {
        name: data.name,
        slug: finalSlug,
        location: data.location,
        discoveryLocation: data.discoveryLocation,
        dateEstimate: data.dateEstimate,
        script: data.script,
        language: data.language,
        transliteration: data.transliteration,
        translation: data.translation,
        description: data.description,
        historicalContext: data.historicalContext,
        verificationStatus: data.verificationStatus || "NEEDS_RESEARCH",
        sourceNote: data.sourceNote,
        categoryId: data.categoryId || null,
      },
      include: { category: true },
    });

    return sendSuccess(res, item, "Inscription created", 201);
  } catch (err) {
    console.error("Create inscription error:", err);
    return sendError(res, "Failed to create inscription", 500);
  }
}

export async function updateInscription(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.inscription.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Inscription not found", 404);

    const finalSlug = data.slug ? toSlug(data.slug) : existing.slug;
    if (finalSlug !== existing.slug) {
      const slugExists = await prisma.inscription.findUnique({ where: { slug: finalSlug } });
      if (slugExists) return sendError(res, "An inscription with this slug already exists", 409);
    }

    const item = await prisma.inscription.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        slug: finalSlug,
        location: data.location !== undefined ? data.location : existing.location,
        discoveryLocation: data.discoveryLocation !== undefined ? data.discoveryLocation : existing.discoveryLocation,
        dateEstimate: data.dateEstimate !== undefined ? data.dateEstimate : existing.dateEstimate,
        script: data.script !== undefined ? data.script : existing.script,
        language: data.language !== undefined ? data.language : existing.language,
        transliteration: data.transliteration !== undefined ? data.transliteration : existing.transliteration,
        translation: data.translation !== undefined ? data.translation : existing.translation,
        description: data.description ?? existing.description,
        historicalContext: data.historicalContext !== undefined ? data.historicalContext : existing.historicalContext,
        verificationStatus: data.verificationStatus ?? existing.verificationStatus,
        sourceNote: data.sourceNote !== undefined ? data.sourceNote : existing.sourceNote,
        categoryId: data.categoryId !== undefined ? (data.categoryId || null) : existing.categoryId,
      },
      include: { category: true },
    });

    return sendSuccess(res, item, "Inscription updated");
  } catch (err) {
    console.error("Update inscription error:", err);
    return sendError(res, "Failed to update inscription", 500);
  }
}

export async function deleteInscription(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.inscription.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Inscription not found", 404);

    await prisma.inscription.delete({ where: { id } });
    return sendSuccess(res, null, "Inscription deleted");
  } catch (err) {
    console.error("Delete inscription error:", err);
    return sendError(res, "Failed to delete inscription", 500);
  }
}
