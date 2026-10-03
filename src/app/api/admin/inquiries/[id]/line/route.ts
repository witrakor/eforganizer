import { currentAdmin, sameOrigin } from "@/lib/auth";
import { query } from "@/lib/db";
import {
  deliverInquiryNotification,
  lineNotificationConfig,
} from "@/lib/line-notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return new Response(null, { status: 403 });
  if (!lineNotificationConfig())
    return Response.json({ error: "ยังไม่ได้ตั้งค่า LINE" }, { status: 503 });
  const { id } = await params;
  const rows = await query<{ status: string }[]>(
    "SELECT status FROM inquiry_line_notifications WHERE inquiry_id=?",
    [id],
  );
  if (!rows.length) return new Response(null, { status: 404 });
  await deliverInquiryNotification(id);
  const [result] = await query<{ line_status: string }[]>(
    "SELECT status AS line_status FROM inquiry_line_notifications WHERE inquiry_id=?",
    [id],
  );
  return Response.json(result);
}
