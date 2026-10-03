import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { query, pool } from "../src/lib/db";
import { deliverInquiryNotification } from "../src/lib/line-notifications";

test("failed LINE delivery retains the inquiry and a concurrent retry sends only once", async () => {
  const id = randomUUID();
  const groupId = `C${"a".repeat(32)}`;
  const originalFetch = globalThis.fetch;
  const oldToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const oldGroup = process.env.LINE_NOTIFICATION_GROUP_ID;
  process.env.LINE_CHANNEL_ACCESS_TOKEN = "test-only-token";
  process.env.LINE_NOTIFICATION_GROUP_ID = groupId;
  let calls = 0;
  let status = 401;
  globalThis.fetch = (async (_url, options) => {
    calls++;
    assert.equal(new Headers(options?.headers).get("X-Line-Retry-Key"), id);
    assert.equal(JSON.parse(String(options?.body)).to, groupId);
    return new Response(null, { status });
  }) as typeof fetch;
  try {
    await query(
      "INSERT INTO inquiries(id,name,email,phone,event_type,event_date,location,guests,budget,message,locale) VALUES (?,?,'',?,'other','','','','undecided',?,'th')",
      [
        id,
        "LINE delivery regression test",
        "0800000000",
        "ทดสอบบรีฟโดยไม่ส่งไป LINE จริง",
      ],
    );
    await query(
      "INSERT INTO inquiry_line_notifications(inquiry_id,group_id) VALUES (?,?)",
      [id, groupId],
    );
    await deliverInquiryNotification(id);
    const [failed] = await query<any[]>(
      "SELECT i.message,n.status FROM inquiries i JOIN inquiry_line_notifications n ON n.inquiry_id=i.id WHERE i.id=?",
      [id],
    );
    assert.equal(failed.status, "failed");
    assert.equal(failed.message, "ทดสอบบรีฟโดยไม่ส่งไป LINE จริง");
    assert.equal(calls, 1);
    status = 200;
    await Promise.all([
      deliverInquiryNotification(id),
      deliverInquiryNotification(id),
    ]);
    assert.equal(calls, 2);
    const [sent] = await query<any[]>(
      "SELECT status,attempts,sent_at FROM inquiry_line_notifications WHERE inquiry_id=?",
      [id],
    );
    assert.equal(sent.status, "sent");
    assert.equal(sent.attempts, 2);
    assert.ok(sent.sent_at);
    await deliverInquiryNotification(id);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = originalFetch;
    if (oldToken === undefined) delete process.env.LINE_CHANNEL_ACCESS_TOKEN;
    else process.env.LINE_CHANNEL_ACCESS_TOKEN = oldToken;
    if (oldGroup === undefined) delete process.env.LINE_NOTIFICATION_GROUP_ID;
    else process.env.LINE_NOTIFICATION_GROUP_ID = oldGroup;
    await query("DELETE FROM inquiries WHERE id=?", [id]);
    await pool().end();
  }
});
