import { BlogRepository } from "@/data/repositories/blog.repository.js";
import type { CreateBlogPostInput, UpdateBlogPostInput, BlogListQueryInput } from "@/core/validation/blog.schema.js";

const repo = new BlogRepository();

export class BlogService {
  async getAllPublished(limit?: number) {
    return repo.findPublished(limit);
  }

  async listAll(query: BlogListQueryInput) {
    return repo.findAll(query);
  }

  async getBySlug(slug: string) {
    const post = await repo.findBySlug(slug);
    return post ?? null;
  }

  async createPost(data: CreateBlogPostInput) {
    const { slugify } = await import("@/core/utils/slug.js");
    const slug = slugify(data.title);
    const existing = await repo.findBySlug(slug);
    if (existing) {
      throw new Error(`A blog post with this title or slug "${slug}" already exists.`);
    }
    return repo.create(data);
  }

  async updatePost(slug: string, data: UpdateBlogPostInput) {
    const updated = await repo.update(slug, data);
    if (!updated) throw new Error("Blog post not found.");
    return updated;
  }

  async deletePost(slug: string) {
    const existing = await repo.findBySlug(slug);
    if (!existing) throw new Error("Blog post not found.");
    return repo.delete(slug);
  }
}
