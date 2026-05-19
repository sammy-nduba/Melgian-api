import { z } from "zod";

export const getDestinationsQuerySchema = z.object({
  popular: z.enum(["true", "false"]).optional(),
  q: z.string().optional(),
});

export type GetDestinationsQueryInput = z.infer<typeof getDestinationsQuerySchema>;
