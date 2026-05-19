# 🦁 Safari Luxe Backend — Project Review & Roadmap

Welcome! This document provides a comprehensive review of your **Safari Luxe Premium Travel Backend** codebase. We have analyzed the structure, identified what is working, pinpointed the root cause of your Prisma Client initialization error, and laid out an actionable roadmap to bring this project to completion.

---

## 📊 Current Project Status at a Glance

You have a very solid foundation! The project is structured with a **Clean Architecture / Layered Pattern** approach using **Fastify** as the high-performance web framework, **Prisma** as the ORM, and **TypeScript** for type safety.

### 🟢 Completed & Functional
*   **Infrastructure Setup:** Fastify server setup, TypeScript compilation config (`tsconfig.json`), Environment Variable validation using Zod (`src/core/config/env.ts`), and standardized JSON API Response utilities.
*   **Middlewares & Security:** Integration of CORS, Helmet (security headers), and Rate Limiting (`src/app.ts`).
*   **Tours Module:** Fully functional repository for fetching all active tours, featured tours, searching tours, and finding a tour by slug along with its itinerary days.
*   **Bookings Module:** Controller, Service, and Repository layers are set up. Booking submissions are validated via Zod, checked for business rules (e.g., date cannot be in the past), and successfully stored in the database with auto-calculated estimated pricing based on tour pricing.
*   **Inquiries Module:** Complete flow for submitting general inquiries with input validation and repository insertion.
*   **Newsletter Module:** Route handler for subscribing/upserting emails (with active state restoration).
*   **Database Seeding:** Seed script (`prisma/seed.ts`) capable of generating a sample luxury Serengeti tour and Serengeti National Park destination.

### 🟡 Partially Implemented / Architectural Inconsistencies
*   **Newsletter Architecture:** The newsletter subscription logic is currently written entirely within the route handler (`src/modules/newsletter/newsletter.routes.ts`). To align with the rest of the project, this should be refactored into a `NewsletterService` and `NewsletterRepository`.
*   **Tours Architecture:** The `TourController` imports `TourRepository` directly, bypassing the Service layer entirely (unlike the Bookings and Inquiries modules). Adding a `TourService` will ensure design consistency.
*   **Clean Architecture Folders:** The `src/domain` directory contains empty placeholder folders (`entities`, `repositories`, `usecases`). While this is typical of standard Clean Architecture, your modules are currently using a simpler **Controller-Service-Repository** pattern. You should decide whether to commit to full Clean Architecture or delete/simplify the unused `src/domain` files to keep the codebase lean.

### 🔴 Missing Features & Modules
The database schema (`schema.prisma`) defines several essential models that do not yet have corresponding module directories, controllers, or routes:
1.  **Destinations Module:** No endpoints to retrieve, list, or filter popular destinations.
2.  **Blog Posts Module:** No routes to fetch published posts, categorize them, or retrieve them by slug.
3.  **Testimonials Module:** No endpoints to fetch testimonials for the homepage.
4.  **FAQs Module:** No endpoints to fetch categorized FAQS.

---

## 🛠️ Resolving the Prisma Client Initialization Error

### The Error
```bash
PrismaClientConstructorValidationError: Using engine type "client" requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor.
```

### Why it Happens
In Prisma 5.10.0+ through Prisma 7, the `engineType = "client"` error is triggered when the generated Prisma Client under your `node_modules/.prisma/client` expects to run in a serverless edge environment (like Cloudflare Workers, Vercel Edge, or using Prisma Accelerate) and requires a **Driver Adapter** (e.g., pg, neon) or an accelerate URL to function. 

Since you are running a traditional Fastify Node.js server with a standard local PostgreSQL database URL (`postgresql://postgres:password@localhost:5432/safari_luxe`), you **do not** want the edge engine. You need the standard **library query engine**.

### How to Fix It
To fix this, you need to clean and regenerate the Prisma Client locally so that it targets the native Node.js runtime instead of the serverless edge runtime.

#### Step 1: Regenerate Prisma Client
Run the following command in your terminal inside the `backend` directory:
```bash
npx prisma generate
```
This forces Prisma to rebuild the client specifically for your current environment, restoring the standard library-based query engine.

#### Step 2: (Optional) Explicitly enforce the Library Engine
If the environment continues to force `engineType = "client"`, you can explicitly tell Prisma to use the library engine by adding the setting in your `schema.prisma` file:

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "library"
}
```
After editing the schema, run:
```bash
npx prisma generate
```

---

## 🗺️ Actionable Step-by-Step Roadmap

Here is how we recommend proceeding to get the project 100% complete and production-ready:

### Phase 1: Debug & Seed (Immediate)
1.  **Fix Prisma Client:** Run `npx prisma generate` to resolve the constructor validation error.
2.  **Initialize Database & Seed:** Ensure Postgres is running (e.g., using your `docker-compose.yml` if configured), then run:
    ```bash
    npm run prisma:migrate
    npm run prisma:seed
    ```
3.  **Verify Server Boots:** Run `npm run dev` and hit `http://localhost:5000/api/health` to confirm the database connects successfully.

### Phase 2: Refactor & Complete Missing Modules
1.  **Create Destinations Module:**
    *   Create `src/modules/destinations/destination.controller.ts`, `destination.service.ts`, and `destination.routes.ts`.
    *   Implement `GET /api/destinations` (all active, popular) and `GET /api/destinations/:slug`.
2.  **Create Blog, Testimonials, and FAQs Modules:**
    *   Implement basic read-only routes for blog posts, testimonials, and FAQs.
3.  **Newsletter & Tour Refactoring:**
    *   Extract the newsletter database operations into a `NewsletterRepository` and validation/business logic into a `NewsletterService`.
    *   Insert a `TourService` between your `TourController` and `TourRepository` for architectural uniformity.

### Phase 3: Advanced Features & Production Hardening
1.  **Admin / Protected Routes:** Set up protection on write endpoints (creating tours, updating bookings) using the `ADMIN_API_SECRET` defined in `.env`.
2.  **Email Notifications:** Integrate a mailer service (like Nodemailer, Resend, or SendGrid) to send automated confirmation emails for booking requests and inquiries using the `BOOKING_NOTIFICATION_EMAIL` env variable.
3.  **API Documentation:** Wire up Fastify Swagger/OpenAPI so your frontend team can easily integrate the backend.

---

### ❓ Key Decisions for You
*   **Architecture Choice:** Do you want to keep the folders in `src/domain` and build a strict Clean Architecture, or should we remove the empty `src/domain` structure and standardize on the highly effective **Controller-Service-Repository** pattern already used in `src/modules/bookings`?
*   **Next Module:** Which module would you like to build first after we fix the Prisma Client? Destinations, Blog, or FAQs?
