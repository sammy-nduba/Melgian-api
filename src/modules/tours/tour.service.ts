import { TourRepository } from "@/data/repositories/tour.repository.js";

/**
 * Handles all business logic and service orchestration for Tour packages.
 */
export class TourService {
  private tourRepository = new TourRepository();

  /**
   * Retrieves tours based on query criteria (featured packages or search queries).
   */
  async getTours(options: { featured?: boolean; q?: string; region?: string }) {
    if (options.featured) {
      return this.tourRepository.findFeatured(options.region);
    }
    if (options.q) {
      return this.tourRepository.search(options.q, options.region);
    }
    return this.tourRepository.findAll(options.region);
  }

  /**
   * Retrieves a single tour package detailed data by its slug.
   */
  async getTourBySlug(slug: string) {
    return this.tourRepository.findBySlug(slug);
  }
}
