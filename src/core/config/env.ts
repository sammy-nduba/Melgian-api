// Environment configuration placeholder
// Load and validate environment variables here
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  ADMIN_API_SECRET: z.string().min(8),
  JWT_SECRET: z.string().min(16),
  BOOKING_NOTIFICATION_EMAIL: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENDER_EMAIL: z.string().email().default("onboarding@resend.dev"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data!;