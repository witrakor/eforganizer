import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { sameOrigin, rateLimit, clientAddress } from "@/lib/auth";
import { pool } from "@/lib/db";
import { inquirySchema } from "@/lib/validation";
import {
  lineNotificationConfig,
  deliverInquiryNotification,
} from "@/lib/line-notifications";
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
    const id = randomUUID();
    const line = lineNotificationConfig();
    const connection = await pool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        "INSERT INTO inquiries(id,name,email,phone,event_type,event_date,location,guests,budget,message,locale) VALUES (?,?,'',?,?,?,?,?,?,?,?)",
        [
          id,
          d.name,
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
      if (line)
        await connection.execute(
          "INSERT INTO inquiry_line_notifications(inquiry_id,group_id) VALUES (?,?)",
          [id, line.groupId],
        );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    if (line) after(() => deliverInquiryNotification(id));
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Unable to save your inquiry" },
      { status: 503 },
    );
  }
}
