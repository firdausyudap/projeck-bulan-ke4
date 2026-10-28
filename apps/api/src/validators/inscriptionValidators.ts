import { z } from "zod";

export const inscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1).max(200).optional(),
  location: z.string().max(200).optional(),
  discoveryLocation: z.string().max(200).optional(),
  dateEstimate: z.string().max(100).optional(),
  script: z.string().max(100).optional(),
  language: z.string().max(100).optional(),
  transliteration: z.string().optional(),
  translation: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  historicalContext: z.string().optional(),
  verificationStatus: z.enum(["VERIFIED", "INTERPRETED", "ORAL_TRADITION", "LEGEND", "DISPUTED", "NEEDS_RESEARCH"]).optional(),
  sourceNote: z.string().optional(),
  categoryId: z.string().optional().nullable(),
});

export const inscriptionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
});
