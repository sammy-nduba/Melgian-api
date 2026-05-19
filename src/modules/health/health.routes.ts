import { FastifyInstance } from "fastify";
import { prisma } from "../../core/db/prisma.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    await prisma.$queryRaw`SELECT 1`;

    return {
      success: true,
      data: {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
    };
  });
}