import fs from "node:fs/promises";
import sharp from "sharp";
const a = JSON.parse(await fs.readFile("scripts/assets.json", "utf8"));
const selection = {
  team: 32,
  conference: 23,
  ceremony: 24,
  festival: 18,
  backstage: 14,
  pageant: 13,
  wedding: 29,
  weddingteam: 34,
  weddingceremony: 6,
  celebration: 37,
  portrait: 15,
  corporate: 26,
  workshop: 22,
  details: 40,
  bride: 36,
};
let manifest = [];
for (const [name, i] of Object.entries(selection)) {
  await sharp(a[i].path)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(`public/media/${name}.webp`);
  manifest.push({
    name,
    url: `/media/${name}.webp`,
    source: "https://www.facebook.com/profile.php?id=61586237753501",
    original: a[i].name,
    width: a[i].width,
    height: a[i].height,
  });
}
await fs.writeFile(
  "public/media/sources.json",
  JSON.stringify(manifest, null, 2),
);
console.log("Prepared", manifest.length, "photos");
