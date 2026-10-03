import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { query, pool } from "../src/lib/db";
import fs from "node:fs/promises";
import { passwordHash, verifyPassword } from "../src/lib/password";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
let cookie = "",
  created: string[] = [];
const testAdminId = randomUUID();
const testAdminEmail = `test-admin-${testAdminId}@example.com`;
const testAdminPassword = `test-only-${randomUUID()}`;
before(async () => {
  await query("INSERT INTO admins(id,email,password_hash) VALUES (?,?,?)", [
    testAdminId,
    testAdminEmail,
    passwordHash(testAdminPassword),
  ]);
});
const testEmail = `test-${randomUUID()}@example.com`;
async function request(
  path: string,
  body?: unknown,
  method = "POST",
  auth = true,
) {
  return fetch(base + path, {
    method,
    headers: {
      Origin: process.env.TEST_ORIGIN || base,
      ...(auth ? { Cookie: cookie } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
}
test("password hashes validate correctly and use random salts", () => {
  const a = passwordHash("safe-test-password"),
    b = passwordHash("safe-test-password");
  assert.notEqual(a, b);
  assert.equal(verifyPassword("safe-test-password", a), true);
  assert.equal(verifyPassword("wrong", a), false);
});
test("public pages render in both languages and missing content returns 404", async () => {
  for (const locale of ["th", "en"])
    for (const path of [
      "",
      "/services",
      "/work",
      "/about",
      "/journal",
      "/contact",
      "/privacy",
      "/services/meetings-conferences",
      "/work/sme-reboost",
      "/journal/a-better-event-brief",
    ]) {
      const r = await fetch(base + "/" + locale + path);
      assert.equal(r.status, 200, path);
      const html = await r.text();
      assert.ok(html.includes("Elite Flow"));
      assert.ok(!html.includes("NEXT_HTTP_ERROR_FALLBACK;500"));
    }
  assert.equal((await fetch(base + "/th/does-not-exist")).status, 404);
});
test("unauthenticated management is denied and cross-origin writes are rejected", async () => {
  assert.equal(
    (await request("/api/admin/content", undefined, "GET", false)).status,
    401,
  );
  assert.equal(
    (await request("/api/admin/media", undefined, "GET", false)).status,
    401,
  );
  assert.equal(
    (
      await fetch(base + "/api/auth/login", {
        method: "POST",
        headers: {
          Origin: "https://evil.example",
          "Content-Type": "application/json",
        },
        body: "{}",
      })
    ).status,
    403,
  );
  const r = await fetch(base + "/admin", { redirect: "manual" });
  assert.equal(r.status, 307);
  assert.ok(r.headers.get("location")?.includes("/admin/login"));
});
test("admin login, bilingual draft, publish, version conflicts and unpublish", async () => {
  const login = await request("/api/auth/login", {
    email: testAdminEmail,
    password: testAdminPassword,
  });
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie")!.split(";")[0];
  assert.ok(cookie.startsWith("ef_session="));
  assert.ok(login.headers.get("set-cookie")?.includes("HttpOnly"));
  const r = await request("/api/admin/content", { kind: "post" });
  assert.equal(r.status, 200);
  const { id } = await r.json();
  created.push(id);
  let list = await (
    await request("/api/admin/content", undefined, "GET")
  ).json();
  const item = list.find((i: any) => i.id === id);
  item.th.title = "บทความทดสอบ";
  item.en.title = "Integration test";
  item.th.body = "ข้อความที่ต้องบันทึก";
  item.en.body = "Persisted English content";
  item.image = "/media/conference.webp";
  assert.equal((await fetch(base + "/th/journal/" + item.slug)).status, 404);
  item.imageFocal = { x: 23, y: 78 };
  let saved = await request("/api/admin/content/" + id, item, "PUT");
  assert.equal(saved.status, 200);
  item.version = (await saved.json()).version;
  const reloaded = await (
    await request("/api/admin/content", undefined, "GET")
  ).json();
  assert.deepEqual(reloaded.find((entry: any) => entry.id === id).imageFocal, {
    x: 23,
    y: 78,
  });
  item.status = "published";
  saved = await request("/api/admin/content/" + id, item, "PUT");
  assert.equal(saved.status, 200);
  assert.equal(
    (await request("/api/admin/content/" + id, item, "PUT")).status,
    409,
  );
  item.version = (await saved.json()).version;
  const pub = await fetch(base + "/en/journal/" + item.slug);
  assert.equal(pub.status, 200);
  assert.ok((await pub.text()).includes("Persisted English content"));
  item.status = "draft";
  assert.equal(
    (await request("/api/admin/content/" + id, item, "PUT")).status,
    200,
  );
  assert.equal((await fetch(base + "/en/journal/" + item.slug)).status, 404);
  const home = list.find((i: any) => i.kind === "page" && i.slug === "home");
  home.status = "draft";
  assert.equal(
    (await request("/api/admin/content/" + home.id, home, "PUT")).status,
    400,
  );
});
test("inquiry saves to MySQL and admin can update status", async () => {
  const data = {
    name: "Integration test",
    email: testEmail,
    phone: "0800000000",
    eventType: "meetings-conferences",
    eventDate: "2026-12-01",
    location: "Khon Kaen",
    guests: "100",
    budget: "100k-300k",
    message: "Automated verification of inquiry persistence.",
    locale: "en",
    consent: true,
    website: "",
  };
  assert.equal(
    (await request("/api/inquiries", data, "POST", false)).status,
    200,
  );
  const rows = await query<any[]>("SELECT * FROM inquiries WHERE email=?", [
    testEmail,
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].message, data.message);
  assert.equal(
    (
      await request(
        "/api/admin/inquiries/" + rows[0].id,
        { status: "contacted" },
        "PATCH",
      )
    ).status,
    200,
  );
  const updated = await query<any[]>(
    "SELECT status FROM inquiries WHERE id=?",
    [rows[0].id],
  );
  assert.equal(updated[0].status, "contacted");
  assert.equal(
    (
      await request(
        "/api/inquiries",
        { ...data, consent: false },
        "POST",
        false,
      )
    ).status,
    400,
  );
});
test("image upload, read, metadata, trash and restore", async () => {
  const form = new FormData();
  form.set(
    "file",
    new File(
      [await fs.readFile("public/media/team.webp")],
      "test-upload.webp",
      { type: "image/webp" },
    ),
  );
  const r = await fetch(base + "/api/admin/media", {
    method: "POST",
    headers: { Origin: process.env.TEST_ORIGIN || base, Cookie: cookie },
    body: form,
  });
  assert.equal(r.status, 200);
  const m = await r.json();
  created.push(m.id);
  const image = await fetch(base + m.url);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get("content-type"), "image/webp");
  assert.equal(
    (
      await request(
        "/api/admin/media/" + m.id,
        { alt: "Test alt", source: "Test source" },
        "PATCH",
      )
    ).status,
    200,
  );
  assert.equal(
    (await request("/api/admin/media/" + m.id, { action: "trash" }, "PATCH"))
      .status,
    200,
  );
  assert.equal((await fetch(base + m.url)).status, 404);
  assert.equal(
    (await request("/api/admin/media/" + m.id, { action: "restore" }, "PATCH"))
      .status,
    200,
  );
  assert.equal((await fetch(base + m.url)).status, 200);
  const invalid = new FormData();
  invalid.set(
    "file",
    new File(["<svg></svg>"], "test.svg", { type: "image/svg+xml" }),
  );
  assert.equal(
    (
      await fetch(base + "/api/admin/media", {
        method: "POST",
        headers: { Origin: process.env.TEST_ORIGIN || base, Cookie: cookie },
        body: invalid,
      })
    ).status,
    400,
  );
});
after(async () => {
  for (const id of created) {
    const rows = await query<any[]>(
      "SELECT storage_key,driver FROM media WHERE id=?",
      [id],
    );
    if (rows[0]?.driver === "local")
      await fs.rm(`storage/uploads/${rows[0].storage_key}`, { force: true });
    await query("DELETE FROM content_revisions WHERE content_id=?", [id]);
    await query("DELETE FROM content WHERE id=?", [id]);
    await query("DELETE FROM media WHERE id=?", [id]);
  }
  await query("DELETE FROM inquiries WHERE email=?", [testEmail]);
  if (cookie) await request("/api/auth/logout");
  await query("DELETE FROM admins WHERE id=?", [testAdminId]);
  await pool().end();
});
