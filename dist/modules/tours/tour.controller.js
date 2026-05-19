import { TourRepository } from "@/data/repositories/tour.repository.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";
const tourRepository = new TourRepository();
export async function getToursController(request, reply) {
    try {
        const { featured, q } = request.query;
        if (featured === "true") {
            const tours = await tourRepository.findFeatured();
            return sendSuccess(reply, tours);
        }
        if (q) {
            const tours = await tourRepository.search(q);
            return sendSuccess(reply, tours);
        }
        const tours = await tourRepository.findAll();
        return sendSuccess(reply, tours);
    }
    catch (error) {
        request.log.error(error);
        return sendError(reply, "Unable to fetch tours.", 500);
    }
}
export async function getTourBySlugController(request, reply) {
    try {
        const tour = await tourRepository.findBySlug(request.params.slug);
        if (!tour) {
            return sendError(reply, "Tour not found.", 404);
        }
        return sendSuccess(reply, tour);
    }
    catch (error) {
        request.log.error(error);
        return sendError(reply, "Unable to fetch tour.", 500);
    }
}
