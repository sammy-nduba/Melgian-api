import { FastifyInstance } from "fastify";
import { createInquiryController } from "./inquiry.controller.js";

export async function inquiryRoutes(app: FastifyInstance) {
  app.post("/", createInquiryController);
}