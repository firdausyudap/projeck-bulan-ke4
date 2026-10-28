import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, sendPaginated } from "../utils/response";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\\w\\s-]/g, "")
    .replace(/[\\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listArticles(req: Request, res: Response) {
  try {
    const { page, limit, search, category, status, tag, sort } = req.query as any;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (!req.user || req.user.role !== "ADMIN") {
      where.status = "PUBLISHED";
    } else if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    const orderBy = sort === "asc" ? { createdAt: "asc" as const } : { createdAt: "desc" as const };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    const formatted = articles.map((a) => ({
      ...a,
      tags: a.tags.map((t) => t.tag),
    }));

    return sendPaginated(res, formatted, { page: pageNum, limit: limitNum, total });
  } catch (err) {
    console.error("List articles error:", err);
    return sendError(res, "Failed to fetch articles", 500);
  }
}

export async function getArticle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const article = await prisma.article.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
        media: true,
      },
    });

    if (!article) {
      return sendError(res, "Article not found", 404);
    }

    if (article.status !== "PUBLISHED" && (!req.user || req.user.role !== "ADMIN")) {
      return sendError(res, "Article not found", 404);
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    const formatted = {
      ...article,
      tags: article.tags.map((t) => t.tag),
    };

    return sendSuccess(res, formatted);
  } catch (err) {
    console.error("Get article error:", err);
    return sendError(res, "Failed to fetch article", 500);
  }
}

export async function createArticle(req: Request, res: Response) {
  try {
    const { title, slug, excerpt, content, coverImage, status, categoryId, tagIds } = req.body;
    const authorId = req.user!.userId;

    const finalSlug = slug ? toSlug(slug) : toSlug(title);

    const existing = await prisma.article.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return sendError(res, "An article with this slug already exists", 409);
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage: coverImage || null,
        status: status || "DRAFT",
        authorId,
        categoryId: categoryId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId: string) => ({ tagId })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const formatted = { ...article, tags: article.tags.map((t) => t.tag) };
    return sendSuccess(res, formatted, "Article created", 201);
  } catch (err) {
    console.error("Create article error:", err);
    return sendError(res, "Failed to create article", 500);
  }
}

export async function updateArticle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, coverImage, status, categoryId, tagIds } = req.body;

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, "Article not found", 404);
    }

    const finalSlug = slug ? toSlug(slug) : existing.slug;

    if (finalSlug !== existing.slug) {
      const slugExists = await prisma.article.findUnique({ where: { slug: finalSlug } });
      if (slugExists) {
        return sendError(res, "An article with this slug already exists", 409);
      }
    }

    if (tagIds !== undefined) {
      await prisma.articleTag.deleteMany({ where: { articleId: id } });
      if (tagIds.length > 0) {
        await prisma.articleTag.createMany({
          data: tagIds.map((tagId: string) => ({ articleId: id, tagId })),
        });
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug: finalSlug,
        excerpt: excerpt ?? existing.excerpt,
        content: content ?? existing.content,
        coverImage: coverImage !== undefined ? (coverImage || null) : existing.coverImage,
        status: status ?? existing.status,
        categoryId: categoryId !== undefined ? (categoryId || null) : existing.categoryId,
        publishedAt:
          status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const formatted = { ...article, tags: article.tags.map((t) => t.tag) };
    return sendSuccess(res, formatted, "Article updated");
  } catch (err) {
    console.error("Update article error:", err);
    return sendError(res, "Failed to update article", 500);
  }
}

export async function deleteArticle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, "Article not found", 404);
    }

    await prisma.article.delete({ where: { id } });
    return sendSuccess(res, null, "Article deleted");
  } catch (err) {
    console.error("Delete article error:", err);
    return sendError(res, "Failed to delete article", 500);
  }
}

