/**
 * scripts/reset-admin.ts
 *
 * One-shot script to force-reset the admin email + password in the production DB.
 * Run via Render CLI:
 *   render run --service <SERVICE_ID> -- npm run reset:admin
 *
 * Or locally against production DATABASE_URL:
 *   DATABASE_URL="..." tsx scripts/reset-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import { pbkdf2, randomBytes } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await pbkdf2Async(password, salt, 100000, 64, "sha512");
  return `${salt}:${derivedKey.toString("hex")}`;
}

const ADMIN_EMAIL = "admin@melgianexpeditions.com";
const ADMIN_PASSWORD = "MelgianAdmin2026!";
const ADMIN_FULL_NAME = "Chief Expedition Officer";

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("🔐 Hashing new admin password...");
    const passwordHash = await hashPassword(ADMIN_PASSWORD);

    console.log(`📧 Upserting admin: ${ADMIN_EMAIL}`);
    const admin = await prisma.admin.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        email: ADMIN_EMAIL,
        password: passwordHash,
        fullName: ADMIN_FULL_NAME,
      },
      create: {
        email: ADMIN_EMAIL,
        password: passwordHash,
        fullName: ADMIN_FULL_NAME,
      },
    });

    console.log(`✅ Admin reset successfully!`);
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name:  ${admin.fullName}`);
    console.log(`\n🔑 Login credentials:`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("❌ Reset failed:", err);
  process.exit(1);
});
