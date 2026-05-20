import { prisma } from "@/core/db/prisma.js";
import {
    BookingListQuery,
    CreateBookingInput,
    UpdateBookingStatusInput,
} from "@/core/validation/booking.schema.js";

export class BookingRepository {
    async createBooking(data: CreateBookingInput) {
        const tour = data.tourSlug
            ? await prisma.tour.findUnique({
                where: { slug: data.tourSlug },
            })
            : null;

        const estimatedAmount = tour
            ? Number(tour.priceFrom) * (data.adults + data.children)
            : undefined;

        // Duplicate guard: same email + tour + date within 24 hours
        const existing = await prisma.booking.findFirst({
            where: {
                email: data.email,
                tourId: tour?.id ?? null,
                travelDate: new Date(data.travelDate),
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
        });

        if (existing) {
            throw new Error(
                "A booking inquiry for this tour and date was already submitted with this email. Please wait 24 hours before resubmitting."
            );
        }

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
                currency: true,
                tourId: true,
                createdAt: true,
            },
        });
    }

    async getBookings(query: BookingListQuery) {
        const { page, limit, status } = query;
        const skip = (page - 1) * limit;

        const where = status ? { status } : {};

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    tour: { select: { title: true, slug: true } },
                },
            }),
            prisma.booking.count({ where }),
        ]);

        return {
            bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async updateStatus(id: string, data: UpdateBookingStatusInput) {
        const existing = await prisma.booking.findUnique({ where: { id } });
        if (!existing) {
            throw new Error("Booking not found.");
        }

        return prisma.booking.update({
            where: { id },
            data: { status: data.status },
            select: {
                id: true,
                status: true,
                fullName: true,
                email: true,
                updatedAt: true,
            },
        });
    }
}