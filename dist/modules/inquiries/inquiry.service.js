import { InquiryRepository } from "@/data/repositories/inquiry.repository.js";
export class InquiryService {
    inquiryRepository;
    constructor(inquiryRepository = new InquiryRepository()) {
        this.inquiryRepository = inquiryRepository;
    }
    async submitInquiry(data) {
        // Add business rules here (e.g. rate limit check, send auto-reply email, notify staff)
        return this.inquiryRepository.createInquiry(data);
    }
}
