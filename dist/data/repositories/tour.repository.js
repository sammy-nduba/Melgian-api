import { prisma } from "@/core/db/prisma.js";
export class TourRepository {
    async findAll() {
        return prisma.tour.findMany({
            where: {
                isActive: true,
            },
            include: {
                itinerary: {
                    orderBy: {
                        day: "asc",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findFeatured() {
        return prisma.tour.findMany({
            where: {
                isActive: true,
                isFeatured: true,
            },
            include: {
                itinerary: {
                    orderBy: {
                        day: "asc",
                    },
                },
            },
            take: 6,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findBySlug(slug) {
        return prisma.tour.findUnique({
            where: {
                slug,
            },
            include: {
                itinerary: {
                    orderBy: {
                        day: "asc",
                    },
                },
            },
        });
    }
    async search(query) {
        return prisma.tour.findMany({
            where: {
                isActive: true,
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        destinationName: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include: {
                itinerary: {
                    orderBy: {
                        day: "asc",
                    },
                },
            },
        });
    }
}
