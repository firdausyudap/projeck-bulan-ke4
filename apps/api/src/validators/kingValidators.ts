import { z } from "zod";

export const kingSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  title: z.string().max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  reignStart: z.string().max(50).optional(),
  reignEnd: z.string().max(50).optional(),
  birthYear: z.string().max(50).optional(),
  deathYear: z.string().max(50).optional(),
  birthPlace: z.string().max(200).optional(),
  deathPlace: z.string().max(200).optional(),
  description: z.string().min(1, "Description is required"),
  biography: z.string().optional(),
  achievements: z.string().optional(),
  verificationStatus: z.enum(["VERIFIED", "INTERPRETED", "ORAL_TRADITION", "LEGEND", "DISPUTED", "NEEDS_RESEARCH"]).optional(),
  sourceNote: z.string().optional(),
  portraitUrl: z.string().url().optional().or(z.literal("")),
});

export const kingQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
});
