/** One-time migration after R2 credentials are configured. Keeps originals as a backup. */
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { query, pool } from "../src/lib/db";
import fs from "node:fs/promises";
import path from "node:path";
for (const key of [
  "R2_ACCOUNT_ID",
  "R2_BUCKET",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
])
  if (!process.env[key]) throw Error(`${key} is required`);
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
const rows = await query<any[]>(
  "SELECT * FROM media WHERE driver IN ('local','bundled') AND deleted_at IS NULL",
);
let count = 0;
for (const m of rows) {
  const data = await fs.readFile(
    m.driver === "bundled"
      ? path.join(process.cwd(), "public", m.url)
      : path.join(process.env.UPLOAD_DIR || "storage/uploads", m.storage_key),
  );
  const key = m.driver === "bundled" ? `${m.id}.webp` : m.storage_key;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: data,
      ContentType: m.mime,
    }),
  );
  const saved = await s3.send(
    new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }),
  );
  if (saved.ContentLength !== data.length)
    throw Error(`Size verification failed: ${m.name}`);
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const url = `/api/media/${m.id}`;
    const [docs] = await conn.query<any[]>(
      "SELECT id,document FROM content FOR UPDATE",
    );
    for (const doc of docs) {
      const value =
        typeof doc.document === "string"
          ? doc.document
          : JSON.stringify(doc.document);
      if (value.includes(m.url)) {
        const replaced = value
          .split(JSON.stringify(m.url))
          .join(JSON.stringify(url));
        await conn.execute(
          "UPDATE content SET document=?,version=version+1 WHERE id=?",
          [replaced, doc.id],
        );
      }
    }
    await conn.execute(
      "UPDATE media SET driver='r2',storage_key=?,url=? WHERE id=?",
      [key, url, m.id],
    );
    await conn.commit();
    count++;
    console.log(`Migrated ${m.name}`);
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
console.log(
  `Verified ${count} R2 objects. Originals retained. Set MEDIA_DRIVER=r2 for future uploads.`,
);
await pool().end();
