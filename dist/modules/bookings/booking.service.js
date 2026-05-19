import { BookingRepository } from "@/data/repositories/booking.repository.js";
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
        return this.bookingRepository.createBooking(data);
    }
}
