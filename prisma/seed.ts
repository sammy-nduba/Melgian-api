// Prisma seed script placeholder
// Implement database seeding logic here
import {
    PrismaClient,
    TourAvailability,
    TourDifficulty,
} from "@prisma/client";
import { hashPassword } from "../src/core/utils/crypto.js";

const prisma = new PrismaClient();

async function main() {
    // Seed Default Admin User
    const adminPasswordHash = await hashPassword("MelgianAdmin2026!");
    await prisma.admin.upsert({
        where: {
            email: "admin@melgianexpeditions.com",
        },
        // Always refresh credentials so re-running the seed is idempotent
        update: {
            email: "admin@melgianexpeditions.com",
            password: adminPasswordHash,
            fullName: "Chief Expedition Officer",
        },
        create: {
            email: "admin@melgianexpeditions.com",
            password: adminPasswordHash,
            fullName: "Chief Expedition Officer",
        },
    });

    await prisma.tour.upsert({
        where: {
            slug: "serengeti-luxury-safari",
        },
        update: {},
        create: {
            slug: "serengeti-luxury-safari",
            title: "Serengeti Luxury Safari",
            subtitle: "A premium wildlife journey through Tanzania",
            description:
                "Experience the Serengeti with expert guides, luxury lodges, and unforgettable wildlife encounters.",
            destinationName: "Tanzania",
            durationDays: 7,
            priceFrom: 4200,
            currency: "USD",
            coverImage: "/images/tours/serengeti.jpg",
            gallery: [],
            rating: 4.9,
            reviewCount: 128,
            minGroupSize: 2,
            maxGroupSize: 12,
            difficulty: TourDifficulty.EASY,
            availability: TourAvailability.AVAILABLE,
            isFeatured: true,
            highlights: [
                "Luxury lodge accommodation",
                "Big Five wildlife viewing",
                "Private safari vehicle",
                "Expert local guides",
            ],
            included: [
                "Accommodation",
                "Meals",
                "Airport transfers",
                "Park fees",
                "Professional guide",
            ],
            excluded: [
                "International flights",
                "Travel insurance",
                "Personal expenses",
            ],
            itinerary: {
                create: [
                    {
                        day: 1,
                        title: "Arrival in Arusha",
                        description: "Meet your guide and settle into your premium lodge.",
                    },
                    {
                        day: 2,
                        title: "Transfer to Serengeti",
                        description: "Begin your safari adventure across the plains.",
                    },
                    {
                        day: 3,
                        title: "Full-Day Game Drive",
                        description:
                            "Explore wildlife-rich areas with your professional guide.",
                    },
                ],
            },
        },
    });

    await prisma.destination.upsert({
        where: {
            slug: "serengeti-national-park",
        },
        update: {},
        create: {
            slug: "serengeti-national-park",
            name: "Serengeti National Park",
            country: "Tanzania",
            description:
                "A legendary safari destination known for endless plains, big cats, and the Great Migration.",
            longDescription:
                "The Serengeti is one of Africa’s most iconic wildlife regions, offering exceptional year-round safari experiences, luxury camps, and breathtaking landscapes.",
            coverImage: "/images/destinations/serengeti.jpg",
            gallery: [],
            bestSeason: "June to October",
            climate: "Warm days, cooler evenings, seasonal rains",
            highlights: [
                "Great Migration",
                "Big cat sightings",
                "Luxury tented camps",
                "Expansive savannah landscapes",
            ],
            isPopular: true,
        },
    });

    console.log("Seed completed.");
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });