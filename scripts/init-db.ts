import { initialize, query, pool } from "../src/lib/db";
import { seedContent } from "../src/lib/seed";
import { passwordHash } from "../src/lib/password";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
await initialize();
for (const c of seedContent)
  await query(
    "INSERT IGNORE INTO content(id,kind,slug,status,document) VALUES (?,?,?,?,?)",
    [c.id, c.kind, c.slug, c.status, JSON.stringify(c)],
  );
const email = process.env.ADMIN_EMAIL,
  password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 14)
  throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (14+ characters)");
await query(
  "INSERT IGNORE INTO admins(id,email,password_hash) VALUES (?,?,?)",
  [randomUUID(), email.toLowerCase(), passwordHash(password)],
);
const images = JSON.parse(
  await fs.readFile("public/media/sources.json", "utf8"),
);
for (const im of images) {
  const existing = await query<any[]>("SELECT id FROM media WHERE url=?", [
    im.url,
  ]);
  if (!existing.length) {
    const stat = await fs.stat(`public${im.url}`);
    await query(
      "INSERT INTO media(id,name,url,mime,size,alt,source,driver,storage_key) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        randomUUID(),
        `${im.name}.webp`,
        im.url,
        "image/webp",
        stat.size,
        im.name,
        im.source,
        "bundled",
        im.url,
      ],
    );
  }
}
console.log(
  "MySQL schema, bilingual content and admin are ready. Existing records preserved.",
);
await pool().end();
