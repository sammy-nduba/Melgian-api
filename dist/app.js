// Application setup placeholder
// Initialize middleware, routes, and plugins here
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "./core/config/env.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { tourRoutes } from "./modules/tours/tour.routes.js";
import { bookingRoutes } from "./modules/bookings/booking.routes.js";
import { inquiryRoutes } from "./modules/inquiries/inquiry.routes.js";
import { newsletterRoutes } from "./modules/newsletter/newsletter.routes.js";
export async function buildApp() {
    const app = Fastify({
        logger: {
            transport: env.NODE_ENV === "development"
                ? {
                    target: "pino-pretty",
                }
                : undefined,
        },
    });
    await app.register(cors, {
        origin: env.FRONTEND_URL,
        credentials: true,
    });
    await app.register(helmet);
    await app.register(rateLimit, {
        max: 100,
        timeWindow: "1 minute",
    });
    await app.register(healthRoutes, { prefix: "/api/health" });
    await app.register(tourRoutes, { prefix: "/api/tours" });
    await app.register(bookingRoutes, { prefix: "/api/bookings" });
    await app.register(inquiryRoutes, { prefix: "/api/inquiries" });
    await app.register(newsletterRoutes, { prefix: "/api/newsletter" });
    return app;
}
