import { FastifyInstance } from "fastify";
import {
  getPublishedPostsController,
  getPostBySlugController,
} from "./blog.controller.js";

export async function blogRoutes(app: FastifyInstance) {
  app.get("/", getPublishedPostsController);
  app.get("/:slug", getPostBySlugController);
}
