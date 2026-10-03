import { test } from "node:test";
import assert from "node:assert/strict";
import { inquiryLineMessages, pushLineMessages } from "../src/lib/line-message";

const inquiry = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  name: "ทดสอบผู้ติดต่อ",
  phone: "0800000000",
  event_type: "other",
  event_date: "",
  location: "ขอนแก่น",
  guests: "100",
  budget: "undecided",
  message: "รายละเอียดงาน ".repeat(350) + "🎉".repeat(400),
};

test("LINE preserves full Thai brief and emoji within text limits", () => {
  const messages = inquiryLineMessages(
    inquiry,
    "อื่น ๆ",
    "https://example.com",
  );
  assert.ok(messages.length <= 5);
  for (const message of messages) {
    assert.ok(message.text.length <= 5000);
    assert.ok(message.text.isWellFormed());
  }
  const full = messages.map((m) => m.text).join("");
  assert.ok(full.includes(inquiry.message));
  assert.ok(full.includes(inquiry.phone));
  assert.ok(full.includes("ต้องการคำแนะนำ"));
  assert.ok(full.includes(`https://example.com/admin/inquiries#${inquiry.id}`));
  assert.ok(
    !inquiryLineMessages(inquiry, "อื่น ๆ", "http://localhost:3100")
      .map((m) => m.text)
      .join("")
      .includes("localhost"),
  );
});

test("LINE retries transient failures with the same recipient, payload and retry key", async () => {
  const calls: RequestInit[] = [];
  const request = (async (_url, init) => {
    calls.push(init!);
    return new Response(null, { status: calls.length === 1 ? 500 : 200 });
  }) as typeof fetch;
  const result = await pushLineMessages(
    "test-token",
    "Cgroup",
    inquiry.id,
    [{ type: "text", text: "Test" }],
    request,
  );
  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0].headers, calls[1].headers);
  assert.equal(calls[0].body, calls[1].body);
  assert.equal(JSON.parse(String(calls[0].body)).to, "Cgroup");
  assert.equal(JSON.parse(String(calls[0].body)).notificationDisabled, false);
});

test("LINE treats an already accepted retry as success and does not retry quota/auth failures", async () => {
  const accepted = await pushLineMessages(
    "test",
    "Cgroup",
    inquiry.id,
    [],
    (async () =>
      new Response(null, {
        status: 409,
        headers: { "x-line-accepted-request-id": "accepted" },
      })) as typeof fetch,
  );
  assert.equal(accepted.ok, true);
  for (const status of [400, 401, 403, 409, 429]) {
    let calls = 0;
    const result = await pushLineMessages(
      "test",
      "Cgroup",
      inquiry.id,
      [],
      (async () => {
        calls++;
        return new Response(null, { status });
      }) as typeof fetch,
    );
    assert.equal(result.ok, false);
    assert.equal(calls, 1);
  }
});
