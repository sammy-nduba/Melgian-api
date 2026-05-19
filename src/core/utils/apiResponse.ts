

import { FastifyReply } from "fastify";

export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  statusCode = 200
) {
  return reply.status(statusCode).send({
    success: true,
    data,
  });
}

export function sendError(
  reply: FastifyReply,
  message: string,
  statusCode = 400,
  details?: unknown
) {
  return reply.status(statusCode).send({
    success: false,
    message,
    details,
  });
}