// Application setup placeholder
// Initialize middleware, routes, and plugins here
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "./core/config/env.js";

import jwt from "@fastify/jwt";
import { healthRoutes } from "./modules/health/health.routes.js";
import { tourRoutes } from "./modules/tours/tour.routes.js";
import { bookingRoutes } from "./modules/bookings/booking.routes.js";
import { inquiryRoutes } from "./modules/inquiries/inquiry.routes.js";
import { newsletterRoutes } from "./modules/newsletter/newsletter.routes.js";
import { destinationRoutes } from "./modules/destinations/destination.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { blogRoutes } from "./modules/blog/blog.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport:
        env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
            }
          : undefined,
    },
  });

  // Always-allowed origins (local dev)
  const allowedOrigins: string[] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    // Production domain — both http and https, with and without www
    "http://melgianexpeditions.com",
    "https://melgianexpeditions.com",
    "http://www.melgianexpeditions.com",
    "https://www.melgianexpeditions.com",
  ];

  // Also include whatever FRONTEND_URL env var is set to (handles Render preview URLs, etc.)
  try {
    const parsedUrl = new URL(env.FRONTEND_URL);
    const protocol = parsedUrl.protocol;
    const hostname = parsedUrl.hostname;
    const port = parsedUrl.port ? `:${parsedUrl.port}` : "";

    const baseOrigin = `${protocol}//${hostname}${port}`;
    if (!allowedOrigins.includes(baseOrigin)) allowedOrigins.push(baseOrigin);

    if (!hostname.startsWith("www.")) {
      const wwwVariant = `${protocol}//www.${hostname}${port}`;
      if (!allowedOrigins.includes(wwwVariant)) allowedOrigins.push(wwwVariant);
    } else {
      const noWwwVariant = `${protocol}//${hostname.substring(4)}${port}`;
      if (!allowedOrigins.includes(noWwwVariant)) allowedOrigins.push(noWwwVariant);
    }
  } catch {
    let directOrigin = env.FRONTEND_URL.trim().replace(/\/$/, "");
    if (!allowedOrigins.includes(directOrigin)) allowedOrigins.push(directOrigin);
  }

  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`Origin '${origin}' not allowed by CORS`), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    // Automatically handle OPTIONS preflight requests
    strictPreflight: false,
    preflight: true,
  });

  await app.register(helmet);

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  await app.register(healthRoutes, { prefix: "/api/health" });
  await app.register(tourRoutes, { prefix: "/api/tours" });
  await app.register(bookingRoutes, { prefix: "/api/bookings" });
  await app.register(inquiryRoutes, { prefix: "/api/inquiries" });
  await app.register(newsletterRoutes, { prefix: "/api/newsletter" });
  await app.register(destinationRoutes, { prefix: "/api/destinations" });
  await app.register(blogRoutes, { prefix: "/api/blog" });
  await app.register(adminRoutes, { prefix: "/api/admin" });

  // Default welcome and API status root route
  app.get("/", async () => {
    return {
      message: "Welcome to Melgian Expeditions Premium Travel API",
      status: "healthy",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        tours: "/api/tours",
        destinations: "/api/destinations",
        blog: "/api/blog",
        bookings: "/api/bookings",
        inquiries: "/api/inquiries",
        newsletter: "/api/newsletter",
        admin: "/api/admin/stats"
      }
    };
  });

  return app;
}