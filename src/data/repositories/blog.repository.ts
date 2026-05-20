import { prisma } from "@/core/db/prisma.js";
import { BlogCategory, BlogStatus } from "@prisma/client";
import { slugify } from "@/core/utils/slug.js";
import type { CreateBlogPostInput, UpdateBlogPostInput, BlogListQueryInput } from "@/core/validation/blog.schema.js";

export class BlogRepository {
  async findAll(query: BlogListQueryInput) {
    const { status, category, featured, limit, page } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured === "true") where.isFeatured = true;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      posts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findPublished(limit?: number) {
    return prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      take: limit ?? 20,
    });
  }

  async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({ where: { slug } });
  }

  async create(data: CreateBlogPostInput) {
    const slug = slugify(data.title);
    const publishedAt = data.status === BlogStatus.PUBLISHED ? new Date() : null;

    return prisma.blogPost.create({
      data: {
        ...data,
        slug,
        publishedAt,
      },
    });
  }

  async update(slug: string, data: UpdateBlogPostInput) {
    const existing = await this.findBySlug(slug);
    if (!existing) return null;

    // Auto-set publishedAt when transitioning to PUBLISHED
    const publishedAt =
      data.status === BlogStatus.PUBLISHED && !existing.publishedAt
        ? new Date()
        : existing.publishedAt;

    return prisma.blogPost.update({
      where: { slug },
      data: { ...data, publishedAt },
    });
  }

  async delete(slug: string) {
    return prisma.blogPost.delete({ where: { slug } });
  }
}
