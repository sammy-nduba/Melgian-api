import { CreateInquiryInput } from "@/core/validation/inquiry.schema.js";
import { InquiryRepository } from "@/data/repositories/inquiry.repository.js";

export class InquiryService {
  constructor(private readonly inquiryRepository = new InquiryRepository()) {}

  async submitInquiry(data: CreateInquiryInput) {
    // Add business rules here (e.g. rate limit check, send auto-reply email, notify staff)
    return this.inquiryRepository.createInquiry(data);
  }
}
