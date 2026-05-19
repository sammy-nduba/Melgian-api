import { CreateBookingInput } from "@/core/validation/booking.schema.js";
import { BookingRepository } from "@/data/repositories/booking.repository.js";
import { sendBookingEmails } from "@/core/utils/mailer.js";
import { prisma } from "@/core/db/prisma.js";

export class BookingService {
    constructor(private readonly bookingRepository = new BookingRepository()) { }

    async submitBooking(data: CreateBookingInput) {
        const travelDate = new Date(data.travelDate);

        if (Number.isNaN(travelDate.getTime())) {
            throw new Error("Invalid travel date.");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (travelDate < today) {
            throw new Error("Travel date cannot be in the past.");
        }

        const booking = await this.bookingRepository.createBooking(data);

        // Fetch tour details and dispatch emails asynchronously in the background
        (async () => {
            try {
                const tour = booking.tourId 
                    ? await prisma.tour.findUnique({
                        where: { id: booking.tourId },
                        select: { title: true, priceFrom: true, currency: true }
                    })
                    : null;
                
                await sendBookingEmails(booking as any, tour);
            } catch (err) {
                console.error("[BOOKING SERVICE] Asynchronous booking email dispatch failed:", err);
            }
        })();

        return booking;
    }
}