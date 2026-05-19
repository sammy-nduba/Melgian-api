import { createBookingSchema } from "@/core/validation/booking.schema";
import { sendError, sendSuccess } from "@/core/utils/apiResponse";
import { BookingService } from "./booking.service";
export async function createBookingController(request, reply) {
    try {
        const parsed = createBookingSchema.safeParse(request.body);
        if (!parsed.success) {
            return sendError(reply, "Invalid booking data.", 422, parsed.error.flatten());
        }
        const bookingService = new BookingService();
        const booking = await bookingService.submitBooking(parsed.data);
        return sendSuccess(reply, {
            message: "Booking inquiry submitted successfully.",
            booking,
        }, 201);
    }
    catch (error) {
        request.log.error(error);
        return sendError(reply, error instanceof Error ? error.message : "Unable to submit booking.", 500);
    }
}
