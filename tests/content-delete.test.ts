import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { query, pool } from "../src/lib/db";
import type { Content } from "../src/lib/types";

test("content deletion authenticates, detects conflicts, hides both locales and survives reseeding", async () => {
  const base = process.env.TEST_BASE_URL || "http://localhost:3100";
  const origin = process.env.TEST_ORIGIN || base;
  const adminId = randomUUID();
  const token = randomBytes(32).toString("hex");
  const ids: string[] = [];
  const headers = {
    Origin: origin,
    Cookie: `ef_session=${token}`,
    "Content-Type": "application/json",
  };
  const request = (
    path: string,
    method: string,
    body?: unknown,
    customHeaders = headers,
  ) =>
    fetch(base + path, {
      method,
      headers: customHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  try {
    await query("INSERT INTO admins(id,email,password_hash) VALUES (?,?,?)", [
      adminId,
      `delete-test-${adminId}@example.com`,
      "unused-test-login",
    ]);
    await query(
      "INSERT INTO sessions(token_hash,admin_id,expires_at) VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL 10 MINUTE))",
      [createHash("sha256").update(token).digest("hex"), adminId],
    );
    for (const [kind, route] of [
      ["post", "journal"],
      ["project", "work"],
      ["service", "services"],
      ["page", "pages"],
    ]) {
      const created = await request("/api/admin/content", "POST", { kind });
      assert.equal(created.status, 200);
      const { id } = await created.json();
      ids.push(id);
      const items: Content[] = await (
        await request("/api/admin/content", "GET")
      ).json();
      const item = items.find((entry) => entry.id === id)!;
      const path = `/api/admin/content/${id}`;
      assert.equal(
        (
          await request(
            path,
            "DELETE",
            { version: item.version },
            { ...headers, Cookie: "" },
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await request(
            path,
            "DELETE",
            { version: item.version },
            { ...headers, Origin: "https://other.example" },
          )
        ).status,
        403,
      );
      assert.equal((await request(path, "DELETE", {})).status, 400);
      item.th.title = "ทดสอบลบเนื้อหา";
      item.en.title = "Deletion test";
      item.image = "/media/conference.webp";
      item.status = "published";
      const saved = await request(path, "PUT", item);
      assert.equal(saved.status, 200);
      assert.equal(
        (await request(path, "DELETE", { version: item.version })).status,
        409,
      );
      item.version = (await saved.json()).version;
      for (const locale of ["th", "en"])
        assert.equal(
          (await fetch(`${base}/${locale}/${route}/${item.slug}`)).status,
          200,
        );
      assert.equal(
        (await request(path, "DELETE", { version: item.version })).status,
        200,
      );
      assert.equal(
        (await request(path, "DELETE", { version: item.version })).status,
        404,
      );
      assert.equal((await request(path, "PUT", item)).status, 404);
      for (const locale of ["th", "en"])
        assert.equal(
          (await fetch(`${base}/${locale}/${route}/${item.slug}`)).status,
          404,
        );
      const list: Content[] = await (
        await request("/api/admin/content", "GET")
      ).json();
      assert.ok(!list.some((entry) => entry.id === id));
      await query(
        "INSERT IGNORE INTO content(id,kind,slug,status,document) VALUES (?,?,?,?,?)",
        [id, kind, item.slug, "published", JSON.stringify(item)],
      );
      const rows = await query<{ status: string; version: number }[]>(
        "SELECT status,version FROM content WHERE id=?",
        [id],
      );
      assert.equal(rows[0].status, "deleted");
      assert.equal(rows[0].version, item.version! + 1);
      const revisions = await query<{ total: number }[]>(
        "SELECT COUNT(*) AS total FROM content_revisions WHERE content_id=?",
        [id],
      );
      assert.ok(revisions[0].total > 0);
    }
  } finally {
    for (const id of ids) {
      await query("DELETE FROM content_revisions WHERE content_id=?", [id]);
      await query("DELETE FROM content WHERE id=?", [id]);
    }
    await query("DELETE FROM admins WHERE id=?", [adminId]);
    await pool().end();
  }
});
