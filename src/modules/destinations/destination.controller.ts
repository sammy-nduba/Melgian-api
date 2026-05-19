import { FastifyReply, FastifyRequest } from "fastify";
import { getDestinationsQuerySchema } from "@/core/validation/destination.schema.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";
import { DestinationService } from "./destination.service.js";

export async function getDestinationsController(
  request: FastifyRequest<{
    Querystring: {
      popular?: string;
      q?: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const parsed = getDestinationsQuerySchema.safeParse(request.query);

    if (!parsed.success) {
      return sendError(
        reply,
        "Invalid query parameters.",
        400,
        parsed.error.flatten()
      );
    }

    const destinationService = new DestinationService();
    const destinations = await destinationService.getDestinations(parsed.data);

    return sendSuccess(reply, destinations);
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to fetch destinations.", 500);
  }
}

export async function getDestinationBySlugController(
  request: FastifyRequest<{
    Params: {
      slug: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const destinationService = new DestinationService();
    const destination = await destinationService.getDestinationBySlug(
      request.params.slug
    );

    return sendSuccess(reply, destination);
  } catch (error) {
    request.log.error(error);
    const message = error instanceof Error ? error.message : "Unable to fetch destination.";
    const status = message === "Destination not found." ? 404 : 500;
    return sendError(reply, message, status);
  }
}
