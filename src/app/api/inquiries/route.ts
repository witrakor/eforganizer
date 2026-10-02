import { randomUUID } from "node:crypto";
import { sameOrigin, rateLimit, clientAddress } from "@/lib/auth";
import { query } from "@/lib/db";
import { inquirySchema } from "@/lib/validation";
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new Response(null, { status: 403 });
  try {
    if (!(await rateLimit(`inquiry:${clientAddress(req)}`, 8, 3600)))
      return Response.json({ error: "Too many requests" }, { status: 429 });
    const result = inquirySchema.safeParse(await req.json());
    if (!result.success)
      return Response.json(
        { error: "Please check required fields" },
        { status: 400 },
      );
    const d = result.data;
    if (d.website) return Response.json({ ok: true });
    await query(
      "INSERT INTO inquiries(id,name,email,phone,event_type,event_date,location,guests,budget,message,locale) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        randomUUID(),
        d.name,
        d.email,
        d.phone,
        d.eventType,
        d.eventDate,
        d.location,
        d.guests,
        d.budget,
        d.message,
        d.locale,
      ],
    );
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Unable to save your inquiry" },
      { status: 503 },
    );
  }
}
