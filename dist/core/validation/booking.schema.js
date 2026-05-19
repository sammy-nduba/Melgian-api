// Booking validation schema placeholder
import { z } from "zod";
export const createBookingSchema = z.object({
    tourSlug: z.string().optional(),
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(7, "Phone number is required"),
    travelDate: z.string().min(1, "Travel date is required"),
    adults: z.number().int().min(1),
    children: z.number().int().min(0).default(0),
    message: z.string().max(2000).optional(),
});
