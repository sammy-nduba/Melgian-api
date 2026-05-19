import { prisma } from "@/core/db/prisma.js";
export class InquiryRepository {
    async createInquiry(data) {
        return prisma.inquiry.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
            },
            select: {
                id: true,
                status: true,
                fullName: true,
                email: true,
                createdAt: true,
            },
        });
    }
}
