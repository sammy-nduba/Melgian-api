import { FastifyReply, FastifyRequest } from "fastify";
import { sendError } from "@/core/utils/apiResponse.js";

/**
 * Fastify preHandler hook to authenticate requests targeting protected Admin endpoints.
 * Verifies JWT tokens present in the Authorization header.
 */
export async function authenticateAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return sendError(reply, "Unauthorized administrative access.", 401);
  }
}
