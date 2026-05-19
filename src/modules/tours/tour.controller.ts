import { FastifyReply, FastifyRequest } from "fastify";
import { TourService } from "./tour.service.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";

const tourService = new TourService();

/**
 * Handles fetching all active tours, with optional query filters (featured, text search).
 */
export async function getToursController(
    request: FastifyRequest<{
        Querystring: {
            featured?: string;
            q?: string;
        };
    }>,
    reply: FastifyReply
) {
    try {
        const { featured, q } = request.query;

        const tours = await tourService.getTours({
            featured: featured === "true",
            q,
        });

        return sendSuccess(reply, tours);
    } catch (error) {
        request.log.error(error);
        return sendError(reply, "Unable to fetch tours.", 500);
    }
}

/**
 * Handles fetching a single tour by its unique URL-friendly slug.
 */
export async function getTourBySlugController(
    request: FastifyRequest<{
        Params: {
            slug: string;
        };
    }>,
    reply: FastifyReply
) {
    try {
        const tour = await tourService.getTourBySlug(request.params.slug);

        if (!tour) {
            return sendError(reply, "Tour not found.", 404);
        }

        return sendSuccess(reply, tour);
    } catch (error) {
        request.log.error(error);
        return sendError(reply, "Unable to fetch tour.", 500);
    }
}