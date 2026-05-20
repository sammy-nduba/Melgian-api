import { FastifyReply, FastifyRequest } from "fastify";
import { adminLoginSchema } from "@/core/validation/admin.schema.js";
import { createTourSchema } from "@/core/validation/tour.schema.js";
import {
  bookingListQuerySchema,
  updateBookingStatusSchema,
} from "@/core/validation/booking.schema.js";
import {
  createDestinationSchema,
  updateDestinationSchema,
} from "@/core/validation/destination.schema.js";
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  blogListQuerySchema,
} from "@/core/validation/blog.schema.js";
import { slugify } from "@/core/utils/slug.js";
import { TourRepository } from "@/data/repositories/tour.repository.js";
import { BookingService } from "@/modules/bookings/booking.service.js";
import { DestinationService } from "@/modules/destinations/destination.service.js";
import { BlogService } from "@/modules/blog/blog.service.js";
import { prisma } from "@/core/db/prisma.js";
import { verifyPassword } from "@/core/utils/crypto.js";
import { sendError, sendSuccess } from "@/core/utils/apiResponse.js";

const tourRepository = new TourRepository();

/**
 * Handles Admin authentication and issues a JWT token.
 */
export async function loginAdminController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = adminLoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(
        reply,
        "Invalid login parameters.",
        400,
        parsed.error.flatten()
      );
    }

    const { email, password } = parsed.data;

    // Retrieve administrative user
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return sendError(reply, "Invalid email or password.", 401);
    }

    // Verify hashed password
    const isPasswordValid = await verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return sendError(reply, "Invalid email or password.", 401);
    }

    // Issue JWT token
    const token = await reply.jwtSign({
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
    });

    return sendSuccess(reply, {
      token,
      user: {
        email: admin.email,
        fullName: admin.fullName,
      },
    });
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Internal server error during login.", 500);
  }
}

/**
 * Gathers aggregate business statistics for the Melgian Expeditions Admin Dashboard.
 */
export async function getAdminStatsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 1. Run aggregate queries in parallel
    const [
      totalBookings,
      pendingBookings,
      totalInquiries,
      activeInquiries,
      newsletterSubscribers,
      activeTours,
      revenueResult,
      recentBookings,
      recentInquiries,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.tour.count({ where: { isActive: true } }),
      prisma.booking.aggregate({
        _sum: {
          estimatedAmount: true,
        },
        where: {
          status: {
            in: ["CONFIRMED", "COMPLETED"],
          },
        },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          tour: {
            select: {
              title: true,
            },
          },
        },
      }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalRevenue = Number(revenueResult._sum.estimatedAmount ?? 0);

    return sendSuccess(reply, {
      stats: {
        totalRevenue,
        totalBookings,
        pendingBookings,
        totalInquiries,
        activeInquiries,
        newsletterSubscribers,
        activeTours,
      },
      recentBookings,
      recentInquiries,
    });
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to load dashboard metrics.", 500);
  }
}

/**
 * Validates, formats, and uploads a new complete Tour package (including itinerary days).
 */
export async function createTourController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = createTourSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(
        reply,
        "Invalid tour input.",
        400,
        parsed.error.flatten()
      );
    }

    const slug = slugify(parsed.data.title);

    // Assert URL slug uniqueness
    const existingTour = await tourRepository.findBySlug(slug);
    if (existingTour) {
      return sendError(
        reply,
        `A tour package with title "${parsed.data.title}" or slug "${slug}" already exists.`,
        400
      );
    }

    const newTour = await tourRepository.create(parsed.data, slug);
    return sendSuccess(reply, newTour, 201);
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Failed to upload tour package.", 500);
  }
}

const bookingService = new BookingService();

/**
 * Returns a paginated, optionally filtered list of all booking inquiries.
 * Accessible by authenticated admins only.
 */
export async function getAdminBookingsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = bookingListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return sendError(reply, "Invalid query parameters.", 400, parsed.error.flatten());
    }

    const result = await bookingService.getBookings(parsed.data);
    return sendSuccess(reply, result);
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to retrieve bookings.", 500);
  }
}

/**
 * Updates the status of a specific booking (PENDING → CONFIRMED / CANCELLED / COMPLETED).
 * Accessible by authenticated admins only.
 */
export async function updateBookingStatusController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    const parsed = updateBookingStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, "Invalid status value.", 422, parsed.error.flatten());
    }

    const updated = await bookingService.updateStatus(id, parsed.data);
    return sendSuccess(reply, { message: "Booking status updated.", booking: updated });
  } catch (error) {
    request.log.error(error);
    return sendError(
      reply,
      error instanceof Error ? error.message : "Unable to update booking status.",
      error instanceof Error && error.message === "Booking not found." ? 404 : 500
    );
  }
}

const destinationService = new DestinationService();

export async function createDestinationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = createDestinationSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, "Invalid destination input.", 400, parsed.error.flatten());
    }

    const slug = slugify(parsed.data.name);
    const newDestination = await destinationService.createDestination(parsed.data, slug);
    return sendSuccess(reply, newDestination, 201);
  } catch (error) {
    request.log.error(error);
    return sendError(
      reply,
      error instanceof Error ? error.message : "Failed to create destination.",
      error instanceof Error && error.message.includes("already exists") ? 400 : 500
    );
  }
}

export async function updateDestinationController(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  try {
    const parsed = updateDestinationSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, "Invalid update input.", 400, parsed.error.flatten());
    }

    const updated = await destinationService.updateDestination(request.params.slug, parsed.data);
    return sendSuccess(reply, updated);
  } catch (error) {
    request.log.error(error);
    return sendError(
      reply,
      error instanceof Error ? error.message : "Failed to update destination.",
      error instanceof Error && error.message === "Destination not found." ? 404 : 500
    );
  }
}

const blogService = new BlogService();

export async function adminListBlogPostsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = blogListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return sendError(reply, "Invalid query parameters.", 400, parsed.error.flatten());
    }
    const result = await blogService.listAll(parsed.data);
    return sendSuccess(reply, result);
  } catch (error) {
    request.log.error(error);
    return sendError(reply, "Unable to retrieve blog posts.", 500);
  }
}

export async function adminCreateBlogPostController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parsed = createBlogPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, "Invalid blog post input.", 400, parsed.error.flatten());
    }
    const post = await blogService.createPost(parsed.data);
    return sendSuccess(reply, post, 201);
  } catch (error) {
    request.log.error(error);
    return sendError(
      reply,
      error instanceof Error ? error.message : "Failed to create blog post.",
      error instanceof Error && error.message.includes("already exists") ? 400 : 500
    );
  }
}

export async function adminUpdateBlogPostController(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  try {
    const parsed = updateBlogPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, "Invalid update input.", 400, parsed.error.flatten());
    }
    const updated = await blogService.updatePost(request.params.slug, parsed.data);
    return sendSuccess(reply, updated);
  } catch (error) {
    request.log.error(error);
    return sendError(
      reply,
      error instanceof Error ? error.message : "Failed to update blog post.",
      error instanceof Error && error.message === "Blog post not found." ? 404 : 500
    );
  }
}

export async function adminDeleteBlogPostController(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  try {
    await blogService.deletePost(request.params.slug);
    return sendSuccess(reply, { message: "Blog post deleted." });
  } catch (error) {
    request.log.error(error);
    return sendError(
      reply,
      error instanceof Error ? error.message : "Failed to delete blog post.",
      error instanceof Error && error.message === "Blog post not found." ? 404 : 500
    );
  }
}
