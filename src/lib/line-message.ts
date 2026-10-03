export type InquiryMessage = {
  id: string;
  name: string;
  phone: string;
  event_type: string;
  event_date: string;
  location: string;
  guests: string;
  budget: string;
  message: string;
};

const budgets: Record<string, string> = {
  undecided: "ต้องการคำแนะนำ",
  "under-100k": "ต่ำกว่า 100,000 บาท",
  "100k-300k": "100,000–300,000 บาท",
  "300k-500k": "300,000–500,000 บาท",
  "500k-plus": "500,000 บาทขึ้นไป",
};

export function inquiryLineMessages(
  inquiry: InquiryMessage,
  eventTitle: string,
  siteUrl?: string,
) {
  const value = (text: string) => text.trim() || "ยังไม่ระบุ";
  const lines = [
    "🔔 Elite Flow · มีบรีฟงานใหม่",
    `ชื่อผู้ติดต่อ: ${inquiry.name}`,
    `โทรศัพท์: ${inquiry.phone}`,
    `ประเภทงาน: ${eventTitle}`,
    `วันที่จัดงาน: ${value(inquiry.event_date)}`,
    `สถานที่: ${value(inquiry.location)}`,
    `จำนวนผู้ร่วมงาน: ${value(inquiry.guests)}`,
    `งบประมาณ: ${budgets[inquiry.budget] || value(inquiry.budget)}`,
    "",
    "รายละเอียดงาน:",
    inquiry.message,
    "",
    `เลขที่บรีฟ: ${inquiry.id}`,
  ];
  if (siteUrl) {
    const url = new URL(siteUrl);
    if (
      url.protocol === "https:" &&
      !["localhost", "127.0.0.1"].includes(url.hostname)
    )
      lines.push(`ดูในหลังบ้าน: ${url.origin}/admin/inquiries#${inquiry.id}`);
  }
  // LINE limits each text object to 5,000 UTF-16 code units.
  let remaining = lines.join("\n");
  const messages: { type: "text"; text: string }[] = [];
  while (remaining.length) {
    let end = Math.min(4500, remaining.length);
    const last = remaining.charCodeAt(end - 1);
    if (last >= 0xd800 && last <= 0xdbff) end--;
    messages.push({ type: "text", text: remaining.slice(0, end) });
    remaining = remaining.slice(end);
  }
  return messages;
}

export async function pushLineMessages(
  token: string,
  groupId: string,
  retryKey: string,
  messages: { type: "text"; text: string }[],
  request: typeof fetch = fetch,
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await request(
        "https://api.line.me/v2/bot/message/push",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Line-Retry-Key": retryKey,
          },
          body: JSON.stringify({
            to: groupId,
            messages,
            notificationDisabled: false,
          }),
          signal: AbortSignal.timeout(5000),
        },
      );
      if (
        response.ok ||
        (response.status === 409 &&
          response.headers.has("x-line-accepted-request-id"))
      )
        return { ok: true as const, error: null };
      if (response.status < 500 || attempt === 2)
        return { ok: false as const, error: `LINE HTTP ${response.status}` };
    } catch {
      if (attempt === 2)
        return {
          ok: false as const,
          error: "LINE connection timeout or network error",
        };
    }
    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }
  return { ok: false as const, error: "LINE delivery failed" };
}
