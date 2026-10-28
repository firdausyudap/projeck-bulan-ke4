import { z } from "zod";

export const familyRelationSchema = z.object({
  fromKingId: z.string().min(1, "fromKingId is required"),
  toKingId: z.string().min(1, "toKingId is required"),
  relationType: z.enum(["PARENT", "CHILD", "SPOUSE", "SIBLING", "OTHER"]),
  description: z.string().optional(),
  verificationStatus: z.enum(["VERIFIED", "INTERPRETED", "ORAL_TRADITION", "LEGEND", "DISPUTED", "NEEDS_RESEARCH"]).optional(),
  sourceNote: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.string().max(20).optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(100).optional(),
});

export const mediaSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  url: z.string().url("Invalid URL"),
  type: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "AUDIO"]),
  altText: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
  credit: z.string().max(200).optional(),
  source: z.string().max(500).optional(),
  license: z.string().max(200).optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().max(100).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
  isIllustration: z.boolean().optional(),
  articleId: z.string().optional().nullable(),
  kingId: z.string().optional().nullable(),
  inscriptionId: z.string().optional().nullable(),
});

export const mediaQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  type: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "AUDIO"]).optional(),
  search: z.string().optional(),
});
