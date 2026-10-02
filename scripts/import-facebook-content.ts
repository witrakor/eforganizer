/** Import reviewed bilingual copy from the Chrome Facebook archive. Original data stays in storage. */
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";
import { pool } from "../src/lib/db";
import { contents } from "../src/lib/content";
import { contentSchema } from "../src/lib/validation";
import { emptyTranslation, type Content } from "../src/lib/types";
const root = "storage/facebook-import-2026-10-01";
const archive = JSON.parse(
  await fs.readFile(`${root}/browser-archive.json`, "utf8"),
);
const matched = JSON.parse(
  await fs.readFile(`${root}/matched-posts.json`, "utf8"),
);
const assets = JSON.parse(
  await fs.readFile(`${root}/usable-assets.json`, "utf8"),
);
const specs = JSON.parse(
  await fs.readFile("scripts/facebook-editorial.json", "utf8"),
);
const existing = await contents(undefined, true);
await fs.mkdir(`${root}/upload`, { recursive: true });
await fs.mkdir("storage/uploads", { recursive: true });
const imported = new Map<string, string>();
const mediaRecords: any[] = [];
const sourceDate = (index: number) => {
  const [day, month] = archive.posts[index].dateLabel.split(" ");
  const m =
    [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ].indexOf(month) + 1;
  return `2026-${String(m).padStart(2, "0")}-${day.padStart(2, "0")}`;
};
async function photo(index: number, postIndex: number) {
  const a = assets[index];
  if (!a) throw Error(`Missing image ${index}`);
  const original = await fs.readFile(a.path);
  const hash = createHash("sha256").update(original).digest("hex");
  if (imported.has(hash)) return imported.get(hash)!;
  const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
  const key = `${id}.webp`;
  const data = await sharp(original)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toBuffer();
  await fs.writeFile(`storage/uploads/${key}`, data);
  await fs.writeFile(`${root}/upload/${key}`, data);
  const url = `/api/media/${id}`;
  mediaRecords.push({
    id,
    key,
    url,
    dataSize: data.length,
    name: `facebook-${postIndex}-${index}.webp`,
    source: archive.posts[postIndex].url,
    alt: `Elite Flow — ภาพงานจากโพสต์ ${sourceDate(postIndex)}`,
  });
  imported.set(hash, url);
  return url;
}
const assetForPath = (p: string) => assets.findIndex((a: any) => a.path === p);
const docs: Content[] = [];
for (const spec of specs.projects) {
  const indices: number[] = spec.posts;
  const first = indices[0];
  const image = await photo(spec.cover, first);
  const gallery: string[] = [];
  for (const idx of indices)
    for (const a of matched[idx].photos) {
      const url = await photo(assetForPath(a.path), idx);
      if (url !== image && !gallery.includes(url)) gallery.push(url);
    }
  const prev = existing.find(
    (c) => c.kind === "project" && c.slug === spec.slug,
  );
  const make = (l: "th" | "en") => ({
    ...emptyTranslation(),
    ...spec[l],
    seoTitle: spec[l].title,
    seoDescription: spec[l].description,
  });
  docs.push({
    ...prev,
    id: prev?.id || randomUUID(),
    kind: "project",
    slug: spec.slug,
    status: "published",
    image,
    gallery: gallery.slice(0, 30),
    category: spec.category || "weddings-private-events",
    featured: true,
    sortOrder: 0,
    date: indices.map(sourceDate).sort().at(-1)!,
    eventDate: spec.eventDate,
    eventDateEnd: spec.eventDateEnd,
    sources: indices.map((i) => ({
      url: archive.posts[i].url,
      publishedAt: sourceDate(i),
      label: "Elite Flow Team · Facebook",
    })),
    th: make("th"),
    en: make("en"),
  });
}
for (const spec of specs.services) {
  const prev = existing.find(
    (c) => c.kind === "service" && c.slug === spec.slug,
  );
  const p = docs.find((c) => c.slug === spec.project)!;
  if (!p) throw Error(spec.project);
  const make = (l: "th" | "en") => ({
    ...emptyTranslation(),
    ...spec[l],
    seoTitle: spec[l].title,
    seoDescription: spec[l].description,
  });
  docs.push({
    ...prev,
    id: prev?.id || randomUUID(),
    kind: "service",
    slug: spec.slug,
    status: "published",
    image: p.image,
    gallery: p.gallery.slice(0, 6),
    category: "",
    featured: true,
    sortOrder: spec.order,
    date: "2026-10-01",
    sources: p.sources,
    th: make("th"),
    en: make("en"),
  });
}
for (const spec of specs.posts) {
  const prev = existing.find((c) => c.kind === "post" && c.slug === spec.slug);
  const image = await photo(spec.cover, spec.source);
  const make = (l: "th" | "en") => ({
    ...emptyTranslation(),
    ...spec[l],
    seoTitle: spec[l].title,
    seoDescription: spec[l].description,
  });
  docs.push({
    ...prev,
    id: prev?.id || randomUUID(),
    kind: "post",
    slug: spec.slug,
    status: "published",
    image,
    gallery: [],
    category: spec.category || "weddings-private-events",
    featured: true,
    sortOrder: 0,
    date: sourceDate(spec.source),
    sources: [
      {
        url: archive.posts[spec.source].url,
        publishedAt: sourceDate(spec.source),
        label: "Elite Flow Team · Facebook",
      },
    ],
    th: make("th"),
    en: make("en"),
  });
}
// Preserve every downloaded page photo in the media library, including images
// that are not selected for publication in a project gallery.
for (const [postIndex, post] of matched.entries()) {
  for (const asset of post.photos)
    await photo(assetForPath(asset.path), postIndex);
}
const home = structuredClone(
  existing.find((c) => c.kind === "page" && c.slug === "home")!,
);
home.th.clientsTitle = "คนสำคัญของเรา\nในวันสำคัญของเขา";
home.en.clientsTitle = "Their important day.\nOur shared story.";
home.th.clientsDescription =
  "จากคู่บ่าวสาวและครอบครัว ไปจนถึงทีมผู้จัดงาน ทุกความไว้วางใจมีเรื่องราวอยู่เบื้องหลัง ชมภาพจริงและบทบาทที่ทีมได้ร่วมดูแล";
home.en.clientsDescription =
  "Couples, families and event teams. Discover the real celebrations behind their trust, and the part our team played.";
home.relationships = (home.relationships || []).filter(
  (r) => r.kind !== "client",
);
for (const slug of specs.clients) {
  const p = docs.find((c) => c.slug === slug)!;
  home.relationships.push({
    id:
      existing
        .find((c) => c.slug === "home")
        ?.relationships?.find((r) => r.href === `/th/work/${slug}`)?.id ||
      randomUUID(),
    kind: "client",
    image: p.image,
    href: `/th/work/${slug}`,
    published: true,
    th: {
      name: String(p.th.client || p.th.title),
      detail: String(p.th.role || p.th.eyebrow),
    },
    en: {
      name: String(p.en.client || p.en.title),
      detail: String(p.en.role || p.en.eyebrow),
    },
  });
}
home.selections = {
  ...home.selections,
  project: [
    ...docs,
    ...existing.filter((c) => !docs.some((d) => d.id === c.id)),
  ]
    .filter((c) => c.kind === "project")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4)
    .map((c) => c.id),
  post: docs
    .filter((c) => c.kind === "post")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((c) => c.id),
};
docs.push(home);
for (const d of docs) contentSchema.parse(d);
await fs.writeFile(
  `${root}/reviewed-content.json`,
  JSON.stringify(docs, null, 2),
);
await fs.writeFile(
  `${root}/upload-manifest.json`,
  JSON.stringify(
    [
      ...new Map(
        [
          ...JSON.parse(
            await fs
              .readFile(`${root}/upload-manifest.json`, "utf8")
              .catch(() => "[]"),
          ),
          ...mediaRecords,
        ].map((m) => [m.id, m]),
      ).values(),
    ],
    null,
    2,
  ),
);
const conn = await pool().getConnection();
try {
  await conn.beginTransaction();
  for (const m of mediaRecords) {
    await conn.execute(
      "INSERT IGNORE INTO media(id,name,url,mime,size,alt,source,driver,storage_key) VALUES(?,?,?,?,?,?,?,?,?)",
      [
        m.id,
        m.name,
        m.url,
        "image/webp",
        m.dataSize,
        m.alt,
        m.source,
        "local",
        m.key,
      ],
    );
  }
  for (const c of docs) {
    const previous = existing.find((p) => p.id === c.id);
    const { version, updatedAt, ...doc } = c;
    if (previous) {
      const [rows] = await conn.execute(
        "SELECT version FROM content WHERE id=? FOR UPDATE",
        [c.id],
      );
      if ((rows as any[])[0].version !== previous.version)
        throw Error(`Concurrent edit: ${c.slug}`);
      await conn.execute(
        "INSERT IGNORE INTO content_revisions(content_id,version,document) VALUES(?,?,?)",
        [c.id, previous.version ?? 1, JSON.stringify(previous)],
      );
      await conn.execute(
        "UPDATE content SET document=?,version=version+1 WHERE id=?",
        [JSON.stringify(doc), c.id],
      );
    } else
      await conn.execute(
        "INSERT INTO content(id,kind,slug,status,document) VALUES(?,?,?,?,?)",
        [c.id, c.kind, c.slug, c.status, JSON.stringify(doc)],
      );
  }
  await conn.commit();
  console.log(
    JSON.stringify(
      {
        content: docs.length,
        projects: docs.filter((c) => c.kind === "project").length,
        services: docs.filter((c) => c.kind === "service").length,
        posts: docs.filter((c) => c.kind === "post").length,
        media: mediaRecords.length,
        clients: home.relationships.filter((r) => r.kind === "client").length,
      },
      null,
      2,
    ),
  );
} catch (e) {
  await conn.rollback();
  throw e;
} finally {
  conn.release();
  await pool().end();
}
