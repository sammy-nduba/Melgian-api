import { FastifyInstance } from "fastify";
import {
  getDestinationBySlugController,
  getDestinationsController,
} from "./destination.controller.js";

export async function destinationRoutes(app: FastifyInstance) {
  app.get("/", getDestinationsController);
  app.get("/:slug", getDestinationBySlugController);
}
