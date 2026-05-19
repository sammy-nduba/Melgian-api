import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);

/**
 * Hashes a plain-text password using native Node.js PBKDF2 hashing.
 * Returns a string formatted as "salt:hash".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await pbkdf2Async(password, salt, 100000, 64, "sha512");
  const hash = derivedKey.toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored native hash.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 2) {
    return false;
  }
  const [salt, key] = parts;
  const derivedKey = await pbkdf2Async(password, salt, 100000, 64, "sha512");
  const hash = derivedKey.toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(key, "hex"));
}
