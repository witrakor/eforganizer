import { pool } from "./db";
import type { Content } from "./types";

const phone = "0939728758";
const oldPhone = "062 896 5444";
const oldEmail = "chaiyawet768@gmail.com";

export async function migratePublicContact() {
  const connection = await pool().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      "SELECT id,slug,document,version FROM content WHERE kind='page' AND slug IN ('contact','privacy') FOR UPDATE",
    );
    for (const row of rows as {
      id: string;
      slug: string;
      document: Content | string;
      version: number;
    }[]) {
      const original =
        typeof row.document === "string"
          ? JSON.parse(row.document)
          : row.document;
      const document = structuredClone(original) as Content;
      if (row.slug === "contact") {
        for (const locale of ["th", "en"] as const) {
          if (document[locale].phone === oldPhone)
            document[locale].phone = phone;
          delete document[locale].email;
        }
      } else {
        document.th.body = document.th.body
          .replace("ชื่อ อีเมล เบอร์โทร", "ชื่อ เบอร์โทร")
          .replace(`กรุณาติดต่อ ${oldEmail}`, `กรุณาโทร ${phone}`);
        document.en.body = document.en.body
          .replace("name, email, phone number", "name, phone number")
          .replace(`contact ${oldEmail}`, `call ${phone}`);
      }
      if (JSON.stringify(document) === JSON.stringify(original)) continue;
      await connection.execute(
        "INSERT IGNORE INTO content_revisions(content_id,version,document) VALUES (?,?,?)",
        [row.id, row.version, JSON.stringify(original)],
      );
      await connection.execute(
        "UPDATE content SET document=?,version=version+1 WHERE id=? AND version=?",
        [JSON.stringify(document), row.id, row.version],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
