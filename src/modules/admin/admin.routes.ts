import { FastifyInstance } from "fastify";
import {
  getAdminStatsController,
  loginAdminController,
  createTourController,
} from "./admin.controller.js";
import { authenticateAdmin } from "./admin.middleware.js";

export async function adminRoutes(app: FastifyInstance) {
  // Public Login route
  app.post("/auth/login", loginAdminController);

  // Administrative Module Index Status check
  app.get("/", async () => {
    return {
      module: "Melgian Expeditions Administrative API",
      status: "operational",
      endpoints: {
        login: "/api/admin/auth/login",
        stats: "/api/admin/stats",
        uploadTour: "/api/admin/tours",
      },
    };
  });

  // Protected Stats dashboard route
  app.get(
    "/stats",
    { preHandler: [authenticateAdmin] },
    getAdminStatsController
  );

  // Protected Tour Upload route
  app.post(
    "/tours",
    { preHandler: [authenticateAdmin] },
    createTourController
  );
}
