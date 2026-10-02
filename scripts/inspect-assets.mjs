import fs from "node:fs/promises";
import sharp from "sharp";
const m = JSON.parse(
  await fs.readFile(
    "/var/folders/xf/5v2_ypyd0_gbb_0cdbc_3h1c0000gn/T/browser-use/assets/9cf45521-8d9f-40fe-8834-ea45fe41b9ff/manifest.json",
    "utf8",
  ),
);
let rows = [];
for (const a of m.assets) {
  try {
    const d = await sharp(a.path).metadata();
    if (d.width >= 450 && d.height >= 250)
      rows.push({ ...a, width: d.width, height: d.height });
  } catch {}
}
await fs.writeFile("scripts/assets.json", JSON.stringify(rows, null, 2));
const tiles = await Promise.all(
  rows.map(async (a, i) => ({
    input: await sharp(a.path)
      .resize(200, 140, { fit: "contain", background: "#eee" })
      .extend({ bottom: 24, background: "#fff" })
      .composite([
        {
          input: Buffer.from(
            `<svg width="200" height="24"><text x="6" y="18" font-size="14">${i} — ${a.width}x${a.height}</text></svg>`,
          ),
          top: 140,
          left: 0,
        },
      ])
      .png()
      .toBuffer(),
    left: (i % 6) * 200,
    top: Math.floor(i / 6) * 164,
  })),
);
await sharp({
  create: {
    width: 1200,
    height: Math.ceil(rows.length / 6) * 164,
    channels: 3,
    background: "#fff",
  },
})
  .composite(tiles)
  .jpeg()
  .toFile("/tmp/eliteflow-contact-sheet.jpg");
console.log("Candidate photos:", rows.length);
