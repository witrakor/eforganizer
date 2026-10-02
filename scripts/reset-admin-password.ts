import { query, pool } from "../src/lib/db";
import { passwordHash } from "../src/lib/password";
const email = process.env.ADMIN_EMAIL,
  password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 14)
  throw Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 14 characters)");
const rows = await query<{ id: string }[]>(
  "SELECT id FROM admins WHERE email=?",
  [email.toLowerCase()],
);
if (!rows.length) throw Error("Admin not found");
await query("UPDATE admins SET password_hash=? WHERE id=?", [
  passwordHash(password),
  rows[0].id,
]);
await query("DELETE FROM sessions WHERE admin_id=?", [rows[0].id]);
console.log(
  "Password updated. All existing sessions for this admin have been revoked.",
);
await pool().end();
