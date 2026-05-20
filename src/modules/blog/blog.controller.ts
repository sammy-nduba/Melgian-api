import { FastifyReply, FastifyRequest } from "fastify";
import { blogListQuerySchema } from "@/core/validation/blog.schema.js";
import { BlogService } from "./blog.service.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";

const blogService = new BlogService();

/**
 * GET /api/blog — returns all published posts (public)
 */
export async function getPublishedPostsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = blogListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return sendError(reply, "Invalid query parameters.", 400, parsed.error.flatten());
    }

    const { limit, page, category, featured } = parsed.data;

    // Public endpoint: always force PUBLISHED status
    const posts = await blogService.listAll({
      status: "PUBLISHED" as any,
      category,
      featured,
      limit,
      page,
    });

    return sendSuccess(reply, posts);
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to retrieve blog posts.", 500);
  }
}

/**
 * GET /api/blog/:slug — returns a single published post (public)
 */
export async function getPostBySlugController(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  try {
    const post = await blogService.getBySlug(request.params.slug);
    if (!post || post.status !== "PUBLISHED") {
      return sendError(reply, "Blog post not found.", 404);
    }
    return sendSuccess(reply, post);
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to retrieve blog post.", 500);
  }
}
