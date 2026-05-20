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

export const updateBookingStatusSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"], {
        errorMap: () => ({ message: "Invalid booking status value." }),
    }),
});

export const bookingListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type BookingListQuery = z.infer<typeof bookingListQuerySchema>;