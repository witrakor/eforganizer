import {
  sameOrigin,
  rateLimit,
  clientAddress,
  verifyPassword,
  createSession,
  passwordHash,
} from "@/lib/auth";
import { query } from "@/lib/db";
export async function POST(req: Request) {
  if (!sameOrigin(req))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const { email, password } = await req.json();
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.length > 254 ||
      password.length > 256
    )
      return Response.json({ error: "Invalid credentials" }, { status: 400 });
    if (
      !(await rateLimit(
        `login:${clientAddress(req)}:${email.toLowerCase()}`,
        8,
        900,
      ))
    )
      return Response.json(
        { error: "ลองใหม่อีกครั้งใน 15 นาที / Try again in 15 minutes" },
        { status: 429 },
      );
    const rows = await query<{ id: string; password_hash: string }[]>(
      "SELECT id,password_hash FROM admins WHERE email=?",
      [email.toLowerCase().trim()],
    );
    const valid = verifyPassword(
      password,
      rows[0]?.password_hash || passwordHash("invalid-placeholder"),
    );
    if (!rows[0] || !valid)
      return Response.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง / Incorrect email or password" },
        { status: 401 },
      );
    await createSession(rows[0].id);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "ระบบไม่พร้อมใช้งาน กรุณาลองใหม่ / Please try again" },
      { status: 503 },
    );
  }
}
