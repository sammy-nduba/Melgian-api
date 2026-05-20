import { FastifyInstance } from "fastify";
import {
  getAdminStatsController,
  loginAdminController,
  createTourController,
  getAdminBookingsController,
  updateBookingStatusController,
  createDestinationController,
  updateDestinationController,
  adminCreateBlogPostController,
  adminUpdateBlogPostController,
  adminDeleteBlogPostController,
  adminListBlogPostsController,
} from "./admin.controller.js";
import { authenticateAdmin } from "./admin.middleware.js";

export async function adminRoutes(app: FastifyInstance) {
  // Public Login route
  app.post("/auth/login", loginAdminController);

  // Administrative Module Index Status check
  app.get("/", async () => {
    return {
      module: "Melgian Expeditions Administrative API",
      status: "operational",
      endpoints: {
        login: "/api/admin/auth/login",
        stats: "/api/admin/stats",
        uploadTour: "/api/admin/tours",
        bookings: "/api/admin/bookings",
        destinations: "/api/admin/destinations",
      },
    };
  });

  // Protected Stats dashboard route
  app.get(
    "/stats",
    { preHandler: [authenticateAdmin] },
    getAdminStatsController
  );

  // Protected Tour Upload route
  app.post(
    "/tours",
    { preHandler: [authenticateAdmin] },
    createTourController
  );

  // Protected Bookings list route (paginated, filterable by status)
  app.get(
    "/bookings",
    { preHandler: [authenticateAdmin] },
    getAdminBookingsController
  );

  // Protected Booking status update route
  app.patch(
    "/bookings/:id/status",
    { preHandler: [authenticateAdmin] },
    updateBookingStatusController
  );

  // Protected Destination creation route
  app.post(
    "/destinations",
    { preHandler: [authenticateAdmin] },
    createDestinationController
  );

  // Protected Destination update route
  app.patch(
    "/destinations/:slug",
    { preHandler: [authenticateAdmin] },
    updateDestinationController
  );

  // Protected Blog list route
  app.get(
    "/blog",
    { preHandler: [authenticateAdmin] },
    adminListBlogPostsController
  );

  // Protected Blog creation route
  app.post(
    "/blog",
    { preHandler: [authenticateAdmin] },
    adminCreateBlogPostController
  );

  // Protected Blog update route
  app.patch(
    "/blog/:slug",
    { preHandler: [authenticateAdmin] },
    adminUpdateBlogPostController
  );

  // Protected Blog deletion route
  app.delete(
    "/blog/:slug",
    { preHandler: [authenticateAdmin] },
    adminDeleteBlogPostController
  );
}

