import { z } from "zod";
import { TourAvailability, TourDifficulty, TourPackageClass } from "@prisma/client";

export const createTourSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  destinationName: z.string().min(1, "Destination name is required"),
  durationDays: z.number().int().positive("Duration must be a positive integer"),
  priceFrom: z.number().positive("Price must be a positive number"),
  currency: z.string().default("USD"),
  coverImage: z.string().min(1, "Cover image path is required"),
  gallery: z.array(z.string()).default([]),
  difficulty: z.nativeEnum(TourDifficulty).default(TourDifficulty.EASY),
  packageClass: z.nativeEnum(TourPackageClass).default(TourPackageClass.EXPLORER_SAFARIS),
  availability: z.nativeEnum(TourAvailability).default(TourAvailability.AVAILABLE),
  highlights: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  itinerary: z
    .array(
      z.object({
        day: z.number().int().positive("Day number must be a positive integer"),
        title: z.string().min(3, "Itinerary title must be at least 3 characters"),
        description: z.string().min(5, "Itinerary description must be at least 5 characters"),
      })
    )
    .min(1, "At least one itinerary day is required"),
});

export type CreateTourInput = z.infer<typeof createTourSchema>;
