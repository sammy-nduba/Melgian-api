import { FastifyInstance } from "fastify";
import { subscribeController } from "./newsletter.controller.js";

/**
 * Registers all public routes under the newsletter module.
 */
export async function newsletterRoutes(app: FastifyInstance) {
  app.post("/", subscribeController);
}