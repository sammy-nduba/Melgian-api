import { prisma } from "../../core/db/prisma.js";
import { TargetAudience } from "@prisma/client";
export class TourRepository {
    getAudienceFilter(region) {
        if (!region)
            return undefined;
        return {
            in: region === "LOCAL"
                ? [TargetAudience.LOCAL, TargetAudience.ALL]
                : [TargetAudience.INTERNATIONAL, TargetAudience.ALL],
        };
    }
    async create(data, slug) {
        const { itinerary, ...tourData } = data;
        return prisma.tour.create({
            data: {
                ...tourData,
                slug,
                itinerary: {
                    create: itinerary,
                },
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
    async findAll(region) {
        return prisma.tour.findMany({
            where: {
                isActive: true,
                targetAudience: this.getAudienceFilter(region),
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
    async findFeatured(region) {
        return prisma.tour.findMany({
            where: {
                isActive: true,
                isFeatured: true,
                targetAudience: this.getAudienceFilter(region),
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
    async search(query, region) {
        return prisma.tour.findMany({
            where: {
                isActive: true,
                targetAudience: this.getAudienceFilter(region),
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
