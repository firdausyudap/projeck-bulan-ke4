import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError } from "../utils/response";

function toSlug(text: string): string {
  return text.toLowerCase().trim().replace(/[^\\w\\s-]/g, "").replace(/[\\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function listTags(req: Request, res: Response) {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return sendSuccess(res, tags);
  } catch (err) {
    console.error("List tags error:", err);
    return sendError(res, "Failed to fetch tags", 500);
  }
}

export async function createTag(req: Request, res: Response) {
  try {
    const data = req.body;
    const finalSlug = data.slug ? toSlug(data.slug) : toSlug(data.name);

    const existing = await prisma.tag.findUnique({ where: { slug: finalSlug } });
    if (existing) return sendError(res, "A tag with this slug already exists", 409);

    const tag = await prisma.tag.create({ data: { name: data.name, slug: finalSlug } });
    return sendSuccess(res, tag, "Tag created", 201);
  } catch (err) {
    console.error("Create tag error:", err);
    return sendError(res, "Failed to create tag", 500);
  }
}

export async function deleteTag(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Tag not found", 404);

    await prisma.tag.delete({ where: { id } });
    return sendSuccess(res, null, "Tag deleted");
  } catch (err) {
    console.error("Delete tag error:", err);
    return sendError(res, "Failed to delete tag", 500);
  }
}
