import { NewsletterRepository } from "@/data/repositories/newsletter.repository.js";

/**
 * Coordinates business rules and processes for Newsletter subscriptions.
 */
export class NewsletterService {
  private newsletterRepository = new NewsletterRepository();

  /**
   * Enrolls an email into the newsletter program.
   */
  async subscribe(email: string, source?: string) {
    return this.newsletterRepository.upsertSubscriber(email, source);
  }
}
