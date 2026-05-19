import { FastifyReply, FastifyRequest } from "fastify";
import { adminLoginSchema } from "@/core/validation/admin.schema.js";
import { createTourSchema } from "@/core/validation/tour.schema.js";
import { slugify } from "@/core/utils/slug.js";
import { TourRepository } from "@/data/repositories/tour.repository.js";
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
