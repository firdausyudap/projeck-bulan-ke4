import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, sendPaginated } from "../utils/response";

export async function listFamilyRelations(req: Request, res: Response) {
  try {
    const { page, limit, kingId } = req.query as any;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (kingId) {
      where.OR = [{ fromKingId: kingId }, { toKingId: kingId }];
    }

    const [items, total] = await Promise.all([
      prisma.familyRelation.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: { fromKing: true, toKing: true },
      }),
      prisma.familyRelation.count({ where }),
    ]);

    return sendPaginated(res, items, { page: pageNum, limit: limitNum, total });
  } catch (err) {
    console.error("List family relations error:", err);
    return sendError(res, "Failed to fetch family relations", 500);
  }
}

export async function createFamilyRelation(req: Request, res: Response) {
  try {
    const data = req.body;
    if (data.fromKingId === data.toKingId) {
      return sendError(res, "Relasi keluarga tidak dapat menunjuk raja yang sama", 400);
    }
    const duplicate = await prisma.familyRelation.findFirst({
      where: { fromKingId: data.fromKingId, toKingId: data.toKingId, relationType: data.relationType },
    });
    if (duplicate) {
      return sendError(res, "Relasi keluarga ganda tidak diizinkan", 409);
    }
    const item = await prisma.familyRelation.create({
      data: {
        fromKingId: data.fromKingId,
        toKingId: data.toKingId,
        relationType: data.relationType,
        description: data.description,
        verificationStatus: data.verificationStatus || "NEEDS_RESEARCH",
        sourceNote: data.sourceNote,
      },
      include: { fromKing: true, toKing: true },
    });
    return sendSuccess(res, item, "Family relation created", 201);
  } catch (err) {
    console.error("Create family relation error:", err);
    return sendError(res, "Failed to create family relation", 500);
  }
}

export async function updateFamilyRelation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.familyRelation.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Family relation not found", 404);

    const nextFromKingId = data.fromKingId ?? existing.fromKingId;
    const nextToKingId = data.toKingId ?? existing.toKingId;
    const nextRelationType = data.relationType ?? existing.relationType;
    if (nextFromKingId === nextToKingId) {
      return sendError(res, "Relasi keluarga tidak dapat menunjuk raja yang sama", 400);
    }
    const duplicate = await prisma.familyRelation.findFirst({
      where: { id: { not: id }, fromKingId: nextFromKingId, toKingId: nextToKingId, relationType: nextRelationType },
    });
    if (duplicate) {
      return sendError(res, "Relasi keluarga ganda tidak diizinkan", 409);
    }
    const item = await prisma.familyRelation.update({
      where: { id },
      data: {
        fromKingId: data.fromKingId ?? existing.fromKingId,
        toKingId: data.toKingId ?? existing.toKingId,
        relationType: data.relationType ?? existing.relationType,
        description: data.description !== undefined ? data.description : existing.description,
        verificationStatus: data.verificationStatus ?? existing.verificationStatus,
        sourceNote: data.sourceNote !== undefined ? data.sourceNote : existing.sourceNote,
      },
      include: { fromKing: true, toKing: true },
    });

    return sendSuccess(res, item, "Family relation updated");
  } catch (err) {
    console.error("Update family relation error:", err);
    return sendError(res, "Failed to update family relation", 500);
  }
}

export async function deleteFamilyRelation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.familyRelation.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Family relation not found", 404);

    await prisma.familyRelation.delete({ where: { id } });
    return sendSuccess(res, null, "Family relation deleted");
  } catch (err) {
    console.error("Delete family relation error:", err);
    return sendError(res, "Failed to delete family relation", 500);
  }
}
