import { prisma } from "@/core/db/prisma.js";
export class BookingRepository {
    async createBooking(data) {
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
                travelDate: true,
                adults: true,
                children: true,
                createdAt: true,
            },
        });
    }
}
