import { seedContent } from "../src/lib/seed";
import { query, pool } from "../src/lib/db";
const seed = seedContent.find((c) => c.slug === "home")!;
const rows = await query<any[]>(
  "SELECT document FROM content WHERE kind='page' AND slug='home'",
);
const c = rows[0].document;
for (const l of ["th", "en"] as const) c[l] = { ...seed[l], ...c[l] };
if (!c.gallery.length) c.gallery = seed.gallery;
await query("UPDATE content SET document=?,version=version+1 WHERE id=?", [
  JSON.stringify(c),
  c.id,
]);
await pool().end();
