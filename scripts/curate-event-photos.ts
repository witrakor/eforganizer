import fs from "node:fs/promises";
import { query, pool } from "../src/lib/db";
import { contents } from "../src/lib/content";
import { eventPhotos, teamPhotos } from "../src/lib/event-photos";
const list = await contents();
const changes = list.filter(
  (c) =>
    (c.kind === "page" && ["home", "about"].includes(c.slug)) ||
    c.kind === "service" ||
    c.kind === "project",
);
await fs.mkdir("storage/backups", { recursive: true });
await fs.writeFile(
  `storage/backups/photo-curation-${Date.now()}.json`,
  JSON.stringify(changes, null, 2),
);
for (const item of changes) {
  const before = JSON.stringify(item);
  if (
    item.kind === "page" &&
    item.slug === "home" &&
    item.image === "/media/conference.webp"
  )
    item.image = "/media/wedding-garden.webp";
  if (item.image === "/media/festival.webp") {
    item.gallery = [...new Set([...eventPhotos(item), item.image])];
    item.image = "/media/festival-conversation.webp";
  } else if (!item.gallery.length) {
    item.gallery = item.slug === "about" ? teamPhotos : eventPhotos(item);
  }
  if (item.slug === "about")
    item.gallery = [
      ...new Set(
        item.gallery.map((src) =>
          src === "/media/conference-host.webp" ? "/media/workshop.webp" : src,
        ),
      ),
    ];
  if (JSON.stringify(item) !== before) {
    await query(
      "UPDATE content SET document=?, version=version+1 WHERE id=? AND version=?",
      [JSON.stringify(item), item.id, item.version],
    );
    console.log("Curated", item.kind, item.slug);
  }
}
await pool().end();
