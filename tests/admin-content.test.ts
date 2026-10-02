import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { emptyTranslation, type Content } from "../src/lib/types";
import {
  contentName,
  filterContent,
  mediaUsage,
} from "../src/lib/admin-content";
import { catalogServices, serviceMenuItems } from "../src/lib/service-catalog";
import { contentSchema } from "../src/lib/validation";
const item = (patch: Partial<Content> = {}): Content => ({
  id: randomUUID(),
  kind: "page",
  slug: "home",
  status: "draft",
  image: "",
  gallery: [],
  category: "",
  featured: false,
  sortOrder: 0,
  date: "2026-10-02",
  th: emptyTranslation(),
  en: emptyTranslation(),
  ...patch,
});
test("content search finds fixed page names and combines type/status without mutating input", () => {
  const home = item(),
    draft = item({
      kind: "post",
      slug: "story",
      updatedAt: "2026-10-02 10:00:00",
    }),
    published = item({
      kind: "post",
      status: "published",
      slug: "older-story",
      updatedAt: "2026-10-01 10:00:00",
    });
  draft.th.title = "เรื่องใหม่";
  published.en.title = "Older story";
  const all = [home, published, draft];
  assert.equal(contentName(home), "หน้าแรก");
  assert.deepEqual(filterContent(all, "all", "all", " หน้าแรก ", "recent"), [
    home,
  ]);
  assert.deepEqual(filterContent(all, "post", "draft", "เรื่อง", "recent"), [
    draft,
  ]);
  assert.deepEqual(filterContent(all, "post", "all", "", "recent"), [
    draft,
    published,
  ]);
  assert.deepEqual(all, [home, published, draft]);
});
test("media usage includes cover, gallery, rich text, relationships and hero slides", () => {
  const url = "/api/media/test-image";
  const cover = item({ image: url }),
    gallery = item({ gallery: [url] }),
    body = item(),
    logo = item(),
    hero = item();
  body.th.body = `![ภาพ](${url})`;
  logo.relationships = [
    {
      id: randomUUID(),
      kind: "client",
      image: url,
      href: "",
      published: false,
      th: { name: "A", detail: "" },
      en: { name: "A", detail: "" },
    },
  ];
  hero.heroSlides = [
    {
      contentId: randomUUID(),
      contentKind: "project",
      image: url,
      x: 50,
      y: 50,
      mobileX: 50,
      mobileY: 50,
    },
  ];
  assert.deepEqual(
    mediaUsage([cover, gallery, body, logo, hero, item()], url).map(
      (c) => c.id,
    ),
    [cover, gallery, body, logo, hero].map((c) => c.id),
  );
  assert.deepEqual(mediaUsage([cover], ""), []);
});
test("service catalog respects editorial translations instead of replacing saved copy", () => {
  const service = item({ kind: "service", slug: "meetings-conferences" });
  service.th.title = "บริการที่แก้ไขแล้ว";
  service.th.subtitle = "รายละเอียดใหม่";
  service.th.items = ["ขอบเขตใหม่"];
  service.en.title = "Edited service";
  service.en.subtitle = "Edited examples";
  const rendered = catalogServices([service]).find(
    (c) => c.slug === service.slug,
  )!;
  assert.equal(rendered.th.title, service.th.title);
  assert.deepEqual(rendered.th.items, service.th.items);
  const menu = serviceMenuItems([service]).find(
    (c) => c.slug === service.slug,
  )!;
  assert.equal(menu.en.title, "Edited service");
  assert.equal(menu.th.examples, "รายละเอียดใหม่");
  assert.ok(catalogServices([]).every((c) => c.th.title && c.en.title));
});
test("home section overrides and explicit service covers survive validation", () => {
  const home = item();
  home.th.heroSubtitle = "หัวข้อรอง";
  home.en.heroDescription = "New introduction";
  home.th.clientSectionTitle = "ลูกค้าของเรา";
  home.coverOverride = true;
  const result = contentSchema.parse(home);
  assert.equal(result.th.heroSubtitle, "หัวข้อรอง");
  assert.equal(result.en.heroDescription, "New introduction");
  assert.equal(result.coverOverride, true);
});
