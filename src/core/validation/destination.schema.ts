import { z } from "zod";

export const getDestinationsQuerySchema = z.object({
  popular: z.enum(["true", "false"]).optional(),
  q: z.string().optional(),
});

export const createDestinationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().min(2, "Country is required"),
  description: z.string().min(10, "Description is required"),
  longDescription: z.string().optional(),
  coverImage: z.string().min(1, "Image is required"),
  gallery: z.array(z.string()).optional().default([]),
  bestSeason: z.string().min(2, "Best season is required"),
  climate: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
  isPopular: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export type GetDestinationsQueryInput = z.infer<typeof getDestinationsQuerySchema>;
export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;

