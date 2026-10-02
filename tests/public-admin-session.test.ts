import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { query, pool } from "../src/lib/db";
import { passwordHash } from "../src/lib/password";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
test("public toolbar session: guest, real login, expiry, protected create and logout", async () => {
  const id = randomUUID();
  const email = `toolbar-test-${id}@example.com`;
  const password = `test-only-${randomUUID()}`;
  const created: string[] = [];
  const send = (
    path: string,
    method = "GET",
    cookie = "",
    body?: unknown,
    origin = process.env.TEST_ORIGIN || base,
  ) =>
    fetch(base + path, {
      method,
      headers: {
        Origin: origin,
        Cookie: cookie,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      redirect: "manual",
    });
  try {
    await query("INSERT INTO admins(id,email,password_hash) VALUES (?,?,?)", [
      id,
      email,
      passwordHash(password),
    ]);
    for (const cookie of ["", "ef_session=invalid-session"]) {
      const response = await send("/api/auth/session", "GET", cookie);
      assert.match(response.headers.get("cache-control") || "", /no-store/);
      assert.equal((await response.json()).authenticated, false);
    }
    assert.equal(
      (await send("/api/admin/content", "POST", "", { kind: "post" })).status,
      403,
    );
    const login = await send("/api/auth/login", "POST", "", {
      email,
      password,
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie")!.split(";")[0];
    const response = await send("/api/auth/session", "GET", cookie);
    const session = await response.json();
    assert.equal(session.authenticated, true);
    assert.ok(Number(session.expiresAt) > Date.now());
    assert.deepEqual(Object.keys(session).sort(), [
      "authenticated",
      "expiresAt",
    ]);
    assert.equal(
      (
        await send(
          "/api/auth/logout",
          "POST",
          cookie,
          undefined,
          "https://other.invalid",
        )
      ).status,
      403,
    );
    for (const kind of ["post", "project", "service", "page"]) {
      const createdResponse = await send("/api/admin/content", "POST", cookie, {
        kind,
      });
      assert.equal(createdResponse.status, 200);
      const result = await createdResponse.json();
      created.push(result.id);
      const rows = await query<{ status: string; kind: string }[]>(
        "SELECT status,kind FROM content WHERE id=?",
        [result.id],
      );
      assert.equal(rows[0].status, "draft");
      assert.equal(rows[0].kind, kind);
      const legacy = await send(`/admin/content/${result.id}`, "GET", cookie);
      assert.equal(legacy.status, 307);
      assert.equal(legacy.headers.get("location"), result.href);
      assert.equal((await send(result.href, "GET", cookie)).status, 200);
      const list = await (
        await send("/api/admin/content", "GET", cookie)
      ).json();
      const item = list.find((entry: { id: string }) => entry.id === result.id);
      item.slug = `renamed-${result.id}`;
      assert.equal(
        (await send(`/api/admin/content/${item.id}`, "PUT", cookie, item))
          .status,
        200,
      );
      const renamed =
        result.href.substring(0, result.href.lastIndexOf("/") + 1) + item.slug;
      assert.equal((await send(result.href, "GET", cookie)).status, 404);
      assert.equal((await send(renamed, "GET", cookie)).status, 200);
      assert.equal(
        (await send(`/admin/content/${item.id}`, "GET", cookie)).headers.get(
          "location",
        ),
        renamed,
      );
    }
    await query(
      "UPDATE sessions SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 SECOND) WHERE admin_id=?",
      [id],
    );
    assert.equal(
      (await (await send("/api/auth/session", "GET", cookie)).json())
        .authenticated,
      false,
    );
    assert.equal(
      (await send("/api/admin/content", "POST", cookie, { kind: "post" }))
        .status,
      403,
    );
    const second = await send("/api/auth/login", "POST", "", {
      email,
      password,
    });
    const secondCookie = second.headers.get("set-cookie")!.split(";")[0];
    const logout = await send("/api/auth/logout", "POST", secondCookie);
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get("set-cookie") || "", /ef_session=;/);
    assert.equal(
      (await (await send("/api/auth/session", "GET", secondCookie)).json())
        .authenticated,
      false,
    );
  } finally {
    for (const contentId of created) {
      await query("DELETE FROM content_revisions WHERE content_id=?", [contentId]);
      await query("DELETE FROM content WHERE id=?", [contentId]);
    }
    await query("DELETE FROM sessions WHERE admin_id=?", [id]);
    await query("DELETE FROM admins WHERE id=?", [id]);
    await pool().end();
  }
});
