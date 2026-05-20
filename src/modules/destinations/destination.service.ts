import { DestinationRepository } from "@/data/repositories/destination.repository.js";
import { GetDestinationsQueryInput, CreateDestinationInput, UpdateDestinationInput } from "@/core/validation/destination.schema.js";

export class DestinationService {
  constructor(
    private readonly destinationRepository = new DestinationRepository()
  ) {}

  async getDestinations(query: GetDestinationsQueryInput) {
    const { popular, q } = query;

    if (popular === "true") {
      return this.destinationRepository.findPopular();
    }

    if (q) {
      return this.destinationRepository.search(q);
    }

    return this.destinationRepository.findAll();
  }

  async getDestinationBySlug(slug: string) {
    const destination = await this.destinationRepository.findBySlug(slug);

    if (!destination || !destination.isActive) {
      throw new Error("Destination not found.");
    }

    return destination;
  }

  async createDestination(data: CreateDestinationInput, slug: string) {
    // Basic check to see if slug exists
    const existing = await this.destinationRepository.findBySlug(slug);
    if (existing) {
      throw new Error("Destination with this slug already exists.");
    }
    return this.destinationRepository.create(data, slug);
  }

  async updateDestination(slug: string, data: UpdateDestinationInput) {
    const existing = await this.destinationRepository.findBySlug(slug);
    if (!existing) {
      throw new Error("Destination not found.");
    }
    return this.destinationRepository.update(slug, data);
  }
}

