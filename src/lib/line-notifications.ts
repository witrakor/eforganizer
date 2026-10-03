import type { ResultSetHeader } from "mysql2";
import { query } from "./db";
import { serviceCategories } from "./service-catalog";
import {
  inquiryLineMessages,
  pushLineMessages,
  type InquiryMessage,
} from "./line-message";

export function lineNotificationConfig() {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
  const groupId = process.env.LINE_NOTIFICATION_GROUP_ID?.trim();
  return token && groupId && /^C[a-f0-9]{32}$/.test(groupId)
    ? { token, groupId }
    : null;
}

export async function deliverInquiryNotification(id: string) {
  const config = lineNotificationConfig();
  if (!config) return;
  // Claim one delivery so a manual retry cannot race the initial send.
  const claimed = await query<ResultSetHeader>(
    "UPDATE inquiry_line_notifications SET status='sending',attempts=attempts+1,updated_at=UTC_TIMESTAMP() WHERE inquiry_id=? AND (status IN ('pending','failed') OR (status='sending' AND updated_at<UTC_TIMESTAMP()-INTERVAL 2 MINUTE))",
    [id],
  );
  if (!claimed.affectedRows) return;
  try {
    const rows = await query<(InquiryMessage & { group_id: string })[]>(
      "SELECT i.*,n.group_id FROM inquiries i JOIN inquiry_line_notifications n ON n.inquiry_id=i.id WHERE i.id=?",
      [id],
    );
    const inquiry = rows[0];
    if (!inquiry) throw new Error("Inquiry missing");
    // Never redirect a queued customer's details to a newly configured group.
    if (inquiry.group_id !== config.groupId)
      throw new Error("Recipient changed");
    const category = serviceCategories.find(
      (item) => item.slug === inquiry.event_type,
    );
    const eventTitle =
      category?.th.title ||
      (inquiry.event_type === "other"
        ? "อื่น ๆ / ยังไม่แน่ใจ"
        : inquiry.event_type);
    const result = await pushLineMessages(
      config.token,
      inquiry.group_id,
      id,
      inquiryLineMessages(inquiry, eventTitle, process.env.SITE_URL),
    );
    await query(
      "UPDATE inquiry_line_notifications SET status=?,last_error=?,sent_at=IF(?='sent',UTC_TIMESTAMP(),sent_at),updated_at=UTC_TIMESTAMP() WHERE inquiry_id=?",
      [
        result.ok ? "sent" : "failed",
        result.error,
        result.ok ? "sent" : "failed",
        id,
      ],
    );
  } catch {
    await query(
      "UPDATE inquiry_line_notifications SET status='failed',last_error='Unable to deliver notification; check configuration',updated_at=UTC_TIMESTAMP() WHERE inquiry_id=?",
      [id],
    );
  }
}
