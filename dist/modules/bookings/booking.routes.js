import { createBookingController } from "./booking.controller.js";
export async function bookingRoutes(app) {
    app.post("/", createBookingController);
}
