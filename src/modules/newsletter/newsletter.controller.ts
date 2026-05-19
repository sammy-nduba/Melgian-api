import { FastifyReply, FastifyRequest } from "fastify";
import { NewsletterService } from "./newsletter.service.js";
import { newsletterSchema } from "@/core/validation/newsletter.schema.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";

const newsletterService = new NewsletterService();

/**
 * Handles incoming subscription requests, validates payloads, and delegates registration.
 */
export async function subscribeController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = newsletterSchema.safeParse(request.body);

    if (!parsed.success) {
      return sendError(
        reply,
        "Invalid newsletter data.",
        422,
        parsed.error.flatten()
      );
    }

    const { email, source } = parsed.data;
    const subscriber = await newsletterService.subscribe(email, source);

    return sendSuccess(
      reply,
      {
        message: "Subscribed successfully.",
        subscriber,
      },
      201
    );
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to subscribe.", 500);
  }
}
