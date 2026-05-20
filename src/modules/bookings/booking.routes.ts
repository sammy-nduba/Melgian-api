import { FastifyInstance } from "fastify";
import { createBookingController } from "./booking.controller.js";

export async function bookingRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      config: {
        // Tighter rate limit for the public booking submission endpoint:
        // max 10 requests per IP per 15 minutes to prevent spam/double-submits.
        rateLimit: {
          max: 10,
          timeWindow: "15 minutes",
        },
      },
    },
    createBookingController
  );
}