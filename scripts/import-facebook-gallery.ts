/** Preserve observed Facebook album images in the CMS without publishing unreviewed galleries. */
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { pool } from "../src/lib/db";
const root = "storage/facebook-import-2026-10-01";
const index = JSON.parse(
  await fs.readFile(`${root}/photos-index.json`, "utf8"),
).photoIndex;
const sourceByName = new Map<string, string>();
for (const p of index)
  for (const u of p.images || [])
    sourceByName.set(new URL(u).pathname.split("/").at(-1)!, p.href);
const used = JSON.parse(
  await fs.readFile(`${root}/usable-assets.json`, "utf8"),
);
const knownNames = new Set(used.map((a: any) => a.name));
const candidates = new Map<string, any>();
const dirs = [
  `${root}/gallery-assets`,
  ...(await fs.readdir(`${root}/gallery-batches`)).map(
    (d) => `${root}/gallery-batches/${d}`,
  ),
];
for (const dir of dirs) {
  const manifest = JSON.parse(
    await fs.readFile(`${dir}/manifest.json`, "utf8"),
  );
  for (const a of manifest.assets) {
    if (!sourceByName.has(a.name) || knownNames.has(a.name)) continue;
    const file = path.join(dir, path.basename(a.path));
    try {
      const m = await sharp(file).metadata();
      const area = (m.width || 0) * (m.height || 0);
      if (area > (candidates.get(a.name)?.area || 0))
        candidates.set(a.name, {
          ...a,
          file,
          area,
          width: m.width,
          height: m.height,
        });
    } catch {}
  }
}
const rows: any[] = [];
for (const a of candidates.values()) {
  const input = await fs.readFile(a.file);
  const hash = createHash("sha256").update(input).digest("hex");
  const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
  const key = `${id}.webp`;
  const data = await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toBuffer();
  await fs.writeFile(`${root}/upload/${key}`, data);
  await fs.writeFile(`storage/uploads/${key}`, data);
  rows.push({
    id,
    key,
    url: `/api/media/${id}`,
    dataSize: data.length,
    name: `facebook-album-${a.name.replace(/\.jpg$/, ".webp")}`,
    source: sourceByName.get(a.name),
    alt: `Elite Flow — ภาพจากอัลบั้ม Facebook (${a.width}×${a.height})`,
    width: a.width,
    height: a.height,
  });
}
const conn = await pool().getConnection();
try {
  await conn.beginTransaction();
  for (const r of rows)
    await conn.execute(
      "INSERT IGNORE INTO media(id,name,url,mime,size,alt,source,driver,storage_key) VALUES(?,?,?,?,?,?,?,?,?)",
      [
        r.id,
        r.name,
        r.url,
        "image/webp",
        r.dataSize,
        r.alt,
        r.source,
        "local",
        r.key,
      ],
    );
  await conn.commit();
} catch (e) {
  await conn.rollback();
  throw e;
} finally {
  conn.release();
  await pool().end();
}
const original = JSON.parse(
  await fs.readFile(`${root}/upload-manifest.json`, "utf8"),
);
const all = [...new Map([...original, ...rows].map((x) => [x.id, x])).values()];
await fs.writeFile(
  `${root}/album-upload-manifest.json`,
  JSON.stringify(rows, null, 2),
);
await fs.writeFile(
  `${root}/upload-manifest.json`,
  JSON.stringify(all, null, 2),
);
console.log({ newAlbumMedia: rows.length, totalMedia: all.length });
