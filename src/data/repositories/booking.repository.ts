import { prisma } from "@/core/db/prisma.js";
import { CreateBookingInput } from "@/core/validation/booking.schema.js";

export class BookingRepository {
    async createBooking(data: CreateBookingInput) {
        const tour = data.tourSlug
            ? await prisma.tour.findUnique({
                where: {
                    slug: data.tourSlug,
                },
            })
            : null;

        const estimatedAmount = tour
            ? Number(tour.priceFrom) * (data.adults + data.children)
            : undefined;

        return prisma.booking.create({
            data: {
                tourId: tour?.id,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                travelDate: new Date(data.travelDate),
                adults: data.adults,
                children: data.children,
                message: data.message,
                currency: tour?.currency ?? "USD",
                estimatedAmount,
            },
            select: {
                id: true,
                status: true,
                fullName: true,
                email: true,
                phone: true,
                travelDate: true,
                adults: true,
                children: true,
                message: true,
                estimatedAmount: true,
                tourId: true,
                createdAt: true,
            },
        });
    }
}