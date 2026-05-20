import { z } from "zod";
import { BlogCategory, BlogStatus } from "@prisma/client";

export const createBlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().min(1, "Cover image is required"),
  category: z.nativeEnum(BlogCategory).default(BlogCategory.SAFARI_PLANNING),
  author: z.string().optional().default("Melgian Expeditions Team"),
  status: z.nativeEnum(BlogStatus).optional().default(BlogStatus.DRAFT),
  readingTimeMinutes: z.number().int().positive().optional().default(5),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogListQuerySchema = z.object({
  status: z.nativeEnum(BlogStatus).optional(),
  category: z.nativeEnum(BlogCategory).optional(),
  featured: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().positive().optional().default(20),
  page: z.coerce.number().int().positive().optional().default(1),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogListQueryInput = z.infer<typeof blogListQuerySchema>;
