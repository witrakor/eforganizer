import { cookies } from "next/headers";
import { hash, sameOrigin } from "@/lib/auth";
import { query } from "@/lib/db";
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new Response(null, { status: 403 });
  const jar = await cookies();
  const t = jar.get("ef_session")?.value;
  if (t) await query("DELETE FROM sessions WHERE token_hash=?", [hash(t)]);
  jar.delete("ef_session");
  return Response.json({ ok: true });
}
