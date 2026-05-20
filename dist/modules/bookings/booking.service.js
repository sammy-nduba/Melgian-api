import { BookingRepository } from "../../data/repositories/booking.repository.js";
import { sendBookingEmails } from "../../core/utils/mailer.js";
import { prisma } from "../../core/db/prisma.js";
export class BookingService {
    bookingRepository;
    constructor(bookingRepository = new BookingRepository()) {
        this.bookingRepository = bookingRepository;
    }
    async submitBooking(data) {
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
                const tourData = tour ? { ...tour, priceFrom: Number(tour.priceFrom) } : null;
                await sendBookingEmails(booking, tourData);
            }
            catch (err) {
                console.error("[BOOKING SERVICE] Asynchronous booking email dispatch failed:", err);
            }
        })();
        return booking;
    }
    async getBookings(query) {
        return this.bookingRepository.getBookings(query);
    }
    async updateStatus(id, data) {
        return this.bookingRepository.updateStatus(id, data);
    }
}
