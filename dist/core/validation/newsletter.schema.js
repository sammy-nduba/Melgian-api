// Newsletter validation schema placeholder
import { z } from "zod";
export const newsletterSchema = z.object({
    email: z.string().email(),
    source: z.string().optional(),
});
