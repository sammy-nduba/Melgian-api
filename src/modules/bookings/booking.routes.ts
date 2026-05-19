import { FastifyInstance } from "fastify";
import { createBookingController } from "./booking.controller.js";

export async function bookingRoutes(app: FastifyInstance) {
  app.post("/", createBookingController);
}