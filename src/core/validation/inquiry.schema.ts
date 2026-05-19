// Inquiry validation schema placeholder
import { z } from "zod";

export const createInquirySchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(3),
    message: z.string().min(10).max(3000),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;