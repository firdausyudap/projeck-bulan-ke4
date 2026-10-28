export type Role = "USER" | "ADMIN";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type VerificationStatus =
  | "VERIFIED"
  | "INTERPRETED"
  | "ORAL_TRADITION"
  | "LEGEND"
  | "DISPUTED"
  | "NEEDS_RESEARCH";

export type RelationType = "PARENT" | "CHILD" | "SPOUSE" | "SIBLING" | "OTHER";

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: ContentStatus;
  viewCount: number;
  authorId: string;
  author?: Pick<User, "id" | "name" | "email">;
  categoryId?: string | null;
  category?: Category | null;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface King {
  id: string;
  name: string;
  title?: string | null;
  slug: string;
  reignStart?: string | null;
  reignEnd?: string | null;
  birthYear?: string | null;
  deathYear?: string | null;
  birthPlace?: string | null;
  deathPlace?: string | null;
  description: string;
  biography?: string | null;
  achievements?: string | null;
  verificationStatus: VerificationStatus;
  sourceNote?: string | null;
  portraitUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyRelation {
  id: string;
  fromKingId: string;
  toKingId: string;
  fromKing?: King;
  toKing?: King;
  relationType: RelationType;
  description?: string | null;
  verificationStatus: VerificationStatus;
  sourceNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Inscription {
  id: string;
  name: string;
  slug: string;
  location?: string | null;
  discoveryLocation?: string | null;
  dateEstimate?: string | null;
  script?: string | null;
  language?: string | null;
  transliteration?: string | null;
  translation?: string | null;
  description: string;
  historicalContext?: string | null;
  verificationStatus: VerificationStatus;
  sourceNote?: string | null;
  categoryId?: string | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: MediaType;
  altText?: string | null;
  caption?: string | null;
  credit?: string | null;
  source?: string | null;
  license?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  isIllustration: boolean;
  articleId?: string | null;
  kingId?: string | null;
  inscriptionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
