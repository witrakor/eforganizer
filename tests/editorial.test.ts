import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { contentSchema } from "../src/lib/validation";
import { emptyTranslation, type Content } from "../src/lib/types";
import {
  selectedContent,
  homeOrder,
  heroSlides,
  defaultHeroSelections,
} from "../src/lib/home-content";
import { passwordHash } from "../src/lib/password";
import { query, pool } from "../src/lib/db";
const sample = (): Content => ({
  id: randomUUID(),
  kind: "page",
  slug: "test-page",
  status: "draft",
  image: "",
  gallery: [],
  category: "",
  featured: false,
  sortOrder: 1,
  date: "2026-10-01",
  th: emptyTranslation(),
  en: emptyTranslation(),
});
test("home selections preserve editorial ordering and never invent unavailable items", () => {
  const home = sample(),
    a = sample(),
    b = sample();
  home.selections = { project: [b.id, randomUUID(), a.id] };
  assert.deepEqual(
    selectedContent(home, "project", [a, b], 4).map((i) => i.id),
    [b.id, a.id],
  );
  assert.deepEqual(
    homeOrder(home).map((section) => section.id),
    [
      "work",
      "process",
      "team",
      "testimonials",
      "partners",
      "journal",
      "faq",
      "contact",
    ],
  );
});
test("relationship content rejects executable links, missing published names and duplicate sections", () => {
  const c = sample();
  c.relationships = [
    {
      id: randomUUID(),
      kind: "client",
      image: "",
      href: "javascript:alert(1)",
      published: false,
      th: { name: "", detail: "" },
      en: { name: "", detail: "" },
    },
  ];
  assert.equal(contentSchema.safeParse(c).success, false);
  c.relationships[0].href = "https://example.com";
  assert.equal(contentSchema.safeParse(c).success, true);
  c.relationships[0].published = true;
  assert.equal(contentSchema.safeParse(c).success, false);
  c.relationships[0].th.name = "ลูกค้า";
  c.relationships[0].en.name = "Client";
  assert.equal(contentSchema.safeParse(c).success, true);
  c.sections = [
    { id: "work", enabled: true },
    { id: "work", enabled: false },
  ];
  assert.equal(contentSchema.safeParse(c).success, false);
});
test("hero slides preserve curation and exclude drafts, missing projects and unrelated photos", () => {
  const home = sample();
  const first = {
    ...sample(),
    kind: "project" as const,
    status: "published" as const,
    slug: "sme-reboost",
    image: "/media/conference.webp",
    gallery: ["/media/corporate.webp"],
  };
  const second = {
    ...first,
    id: randomUUID(),
    slug: "min-chat-wedding",
    image: "/media/wedding.webp",
    gallery: ["/media/wedding-garden.webp"],
  };
  const a = {
    projectId: first.id,
    image: first.gallery[0],
    x: 50,
    y: 40,
    mobileX: 30,
    mobileY: 60,
  };
  const b = { ...a, projectId: second.id, image: second.gallery[0] };
  home.heroSlides = [b, a];
  assert.deepEqual(
    heroSlides(home, [first, second], "en").map((s) => s.href),
    ["/en/work/min-chat-wedding", "/en/work/sme-reboost"],
  );
  assert.equal(
    heroSlides(home, [first, { ...second, status: "draft" }], "th").length,
    1,
  );
  assert.equal(heroSlides(home, [], "th").length, 0);
  home.heroSlides = [{ ...a, image: second.image }];
  assert.equal(heroSlides(home, [first, second], "th").length, 0);
  home.heroSlides = [{ ...a, image: first.image }];
  assert.equal(
    heroSlides(home, [first], "th").length,
    0,
    "Hero must not repeat a selected work cover",
  );
  home.heroSlides = [];
  assert.equal(heroSlides(home, [first], "th").length, 0);
  assert.deepEqual(
    defaultHeroSelections([second, first]).map((s) => s.projectId),
    [first.id, second.id],
  );
  home.heroSlides = [a];
  assert.equal(contentSchema.safeParse(home).success, true);
  home.heroSlides = [{ ...a, mobileX: 101 }];
  assert.equal(contentSchema.safeParse(home).success, false);
  home.heroSlides = Array(7).fill(a);
  assert.equal(contentSchema.safeParse(home).success, false);
});
test("CMS saves structured home data and retains previous versions without publishing drafts", async () => {
  const base = process.env.TEST_BASE_URL || "http://localhost:3100";
  const testAdminId = randomUUID();
  const testAdminEmail = `test-editor-${testAdminId}@example.com`;
  const testAdminPassword = `test-only-${randomUUID()}`;
  await query("INSERT INTO admins(id,email,password_hash) VALUES (?,?,?)", [
    testAdminId,
    testAdminEmail,
    passwordHash(testAdminPassword),
  ]);
  const login = await fetch(base + "/api/auth/login", {
    method: "POST",
    headers: {
      Origin: process.env.TEST_ORIGIN || base,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: testAdminEmail,
      password: testAdminPassword,
    }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie")!.split(";")[0];
  const headers = {
    Origin: process.env.TEST_ORIGIN || base,
    "Content-Type": "application/json",
    Cookie: cookie,
  };
  let id = "";
  try {
    const created = await fetch(base + "/api/admin/content", {
      method: "POST",
      headers,
      body: JSON.stringify({ kind: "page" }),
    });
    id = (await created.json()).id;
    const all = await (
      await fetch(base + "/api/admin/content", { headers })
    ).json();
    const item = all.find((i: Content) => i.id === id);
    item.th.title = "CMS revision test";
    item.en.title = "CMS revision test";
    item.sections = [
      { id: "work", enabled: true },
      { id: "journal", enabled: false },
    ];
    item.heroSlides = [
      {
        projectId: randomUUID(),
        image: "/media/conference.webp",
        x: 50,
        y: 40,
        mobileX: 30,
        mobileY: 60,
      },
    ];
    item.relationships = [
      {
        id: randomUUID(),
        kind: "partner",
        image: "",
        href: "",
        published: false,
        th: { name: "Draft partner", detail: "" },
        en: { name: "Draft partner", detail: "" },
      },
    ];
    let r = await fetch(base + "/api/admin/content/" + id, {
      method: "PUT",
      headers,
      body: JSON.stringify(item),
    });
    assert.equal(r.status, 200);
    item.version = (await r.json()).version;
    item.th.title = "Second revision";
    r = await fetch(base + "/api/admin/content/" + id, {
      method: "PUT",
      headers,
      body: JSON.stringify(item),
    });
    assert.equal(r.status, 200);
    const history = await (
      await fetch(base + "/api/admin/content/" + id + "/revisions", { headers })
    ).json();
    assert.equal(history.length, 2);
    assert.equal(history[0].document.th.title, "CMS revision test");
    assert.equal(history[0].document.sections[1].enabled, false);
    assert.deepEqual(history[0].document.heroSlides, item.heroSlides);
    assert.equal((await fetch(base + "/th/pages/" + item.slug)).status, 404);
    assert.equal(
      (await fetch(base + "/api/admin/content/" + id + "/revisions")).status,
      401,
    );
    // Removing the final Hero image must persist an explicit empty selection.
    const saved = (
      await (await fetch(base + "/api/admin/content", { headers })).json()
    ).find((entry: Content) => entry.id === id);
    const reduced = await fetch(base + "/api/admin/content/" + id, {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...saved, heroSlides: [] }),
    });
    assert.equal(reduced.status, 200);
    const reloaded = (
      await (await fetch(base + "/api/admin/content", { headers })).json()
    ).find((entry: Content) => entry.id === id);
    assert.deepEqual(reloaded.heroSlides, []);
    const preview = await fetch(base + "/admin/preview", { headers });
    assert.equal(preview.status, 200);
    assert.equal(preview.headers.get("x-frame-options"), "SAMEORIGIN");
  } finally {
    if (id) {
      await query("DELETE FROM content_revisions WHERE content_id=?", [id]);
      await query("DELETE FROM content WHERE id=?", [id]);
    }
    await query("DELETE FROM admins WHERE id=?", [testAdminId]);
    await pool().end();
  }
});
