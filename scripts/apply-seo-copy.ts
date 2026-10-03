import { pool } from "../src/lib/db";
import { seoCopy } from "../src/lib/seo-copy";
import type { Content } from "../src/lib/types";

type Row = {
  id: string;
  version: number;
  document: Content | string;
};

const connection = await pool().getConnection();
let changed = 0;
try {
  await connection.beginTransaction();
  const [rows] = await connection.execute(
    "SELECT id,version,document FROM content WHERE status='published' FOR UPDATE",
  );
  for (const row of rows as Row[]) {
    const document =
      typeof row.document === "string"
        ? (JSON.parse(row.document) as Content)
        : row.document;
    const next = structuredClone(document);
    for (const locale of ["th", "en"] as const) {
      const copy = seoCopy(next, locale, false);
      next[locale].seoTitle = copy.title;
      next[locale].seoDescription = copy.description;
    }
    if (
      next.th.seoTitle === document.th.seoTitle &&
      next.th.seoDescription === document.th.seoDescription &&
      next.en.seoTitle === document.en.seoTitle &&
      next.en.seoDescription === document.en.seoDescription
    )
      continue;
    await connection.execute(
      "INSERT IGNORE INTO content_revisions(content_id,version,document) VALUES (?,?,?)",
      [row.id, row.version, JSON.stringify(document)],
    );
    await connection.execute(
      "UPDATE content SET document=?,version=version+1 WHERE id=? AND version=?",
      [JSON.stringify(next), row.id, row.version],
    );
    changed++;
  }
  await connection.commit();
  console.log(`Updated SEO copy for ${changed} published content records.`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
  await pool().end();
}
