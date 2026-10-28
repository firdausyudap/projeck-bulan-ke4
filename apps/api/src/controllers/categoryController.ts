import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, sendPaginated } from "../utils/response";

function toSlug(text: string): string {
  return text.toLowerCase().trim().replace(/[^\\w\\s-]/g, "").replace(/[\\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return sendSuccess(res, categories);
  } catch (err) {
    console.error("List categories error:", err);
    return sendError(res, "Failed to fetch categories", 500);
  }
}

export async function getCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await prisma.category.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!category) return sendError(res, "Category not found", 404);
    return sendSuccess(res, category);
  } catch (err) {
    console.error("Get category error:", err);
    return sendError(res, "Failed to fetch category", 500);
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const data = req.body;
    const finalSlug = data.slug ? toSlug(data.slug) : toSlug(data.name);

    const existing = await prisma.category.findUnique({ where: { slug: finalSlug } });
    if (existing) return sendError(res, "A category with this slug already exists", 409);

    const category = await prisma.category.create({
      data: { name: data.name, slug: finalSlug, description: data.description, color: data.color },
    });
    return sendSuccess(res, category, "Category created", 201);
  } catch (err) {
    console.error("Create category error:", err);
    return sendError(res, "Failed to create category", 500);
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Category not found", 404);

    const finalSlug = data.slug ? toSlug(data.slug) : existing.slug;
    if (finalSlug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({ where: { slug: finalSlug } });
      if (slugExists) return sendError(res, "A category with this slug already exists", 409);
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        slug: finalSlug,
        description: data.description !== undefined ? data.description : existing.description,
        color: data.color !== undefined ? data.color : existing.color,
      },
    });
    return sendSuccess(res, category, "Category updated");
  } catch (err) {
    console.error("Update category error:", err);
    return sendError(res, "Failed to update category", 500);
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return sendError(res, "Category not found", 404);

    await prisma.category.delete({ where: { id } });
    return sendSuccess(res, null, "Category deleted");
  } catch (err) {
    console.error("Delete category error:", err);
    return sendError(res, "Failed to delete category", 500);
  }
}
