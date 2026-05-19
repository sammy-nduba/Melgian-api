import { prisma } from "@/core/db/prisma.js";

/**
 * Handles database operations for the NewsletterSubscriber database model.
 */
export class NewsletterRepository {
  /**
   * Subscribes a user by email, activating or creating their record.
   */
  async upsertSubscriber(email: string, source?: string) {
    return prisma.newsletterSubscriber.upsert({
      where: {
        email,
      },
      update: {
        isActive: true,
        source,
      },
      create: {
        email,
        source,
      },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });
  }
}
