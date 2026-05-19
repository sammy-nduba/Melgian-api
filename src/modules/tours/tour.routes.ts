import { FastifyInstance } from "fastify";
import {
  getTourBySlugController,
  getToursController,
} from "./tour.controller.js";

export async function tourRoutes(app: FastifyInstance) {
  app.get("/", getToursController);
  app.get("/:slug", getTourBySlugController);
}