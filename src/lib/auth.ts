import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "./db";
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export { passwordHash, verifyPassword } from "./password";
export async function currentAdmin() {
  const token = (await cookies()).get("ef_session")?.value;
  if (!token) return null;
  const rows = await query<{ id: string; email: string }[]>(
    "SELECT a.id,a.email FROM sessions s JOIN admins a ON s.admin_id=a.id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP()",
    [hash(token)],
  );
  return rows[0] ?? null;
}
export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
export async function createSession(id: string) {
  const token = randomBytes(32).toString("hex");
  await query("DELETE FROM sessions WHERE expires_at<UTC_TIMESTAMP()");
  await query(
    "INSERT INTO sessions(token_hash,admin_id,expires_at) VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL 12 HOUR))",
    [hash(token), id],
  );
  (await cookies()).set("ef_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.SITE_URL?.startsWith("https://"),
    path: "/",
    maxAge: 43200,
  });
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  return (
    !!origin &&
    (origin === new URL(req.url).origin || origin === process.env.SITE_URL)
  );
}
export async function rateLimit(key: string, max: number, seconds: number) {
  const bucket = hash(key),
    now = Date.now();
  await query(
    "INSERT INTO rate_limits(bucket,hits,reset_at) VALUES (?,1,?) ON DUPLICATE KEY UPDATE hits=IF(reset_at < ?,1,hits+1),reset_at=IF(reset_at < ?,?,reset_at)",
    [bucket, now + seconds * 1000, now, now, now + seconds * 1000],
  );
  const r = await query<{ hits: number }[]>(
    "SELECT hits FROM rate_limits WHERE bucket=?",
    [bucket],
  );
  return r[0].hits <= max;
}
export function clientAddress(req: Request) {
  return process.env.TRUST_PROXY === "true"
    ? req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
    : "local";
}
