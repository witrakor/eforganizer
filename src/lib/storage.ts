import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "node:fs/promises";
import path from "node:path";
export function storageDriver() {
  return process.env.MEDIA_DRIVER === "r2" ? "r2" : "local";
}
function r2() {
  if (
    !process.env.R2_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY ||
    !process.env.R2_BUCKET
  )
    throw new Error("R2 configuration is incomplete");
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}
export async function storeFile(key: string, data: Buffer, mime: string) {
  const driver = storageDriver();
  if (driver === "r2")
    await r2().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: data,
        ContentType: mime,
      }),
    );
  else {
    const folder = path.resolve(
      /* turbopackIgnore: true */ process.env.UPLOAD_DIR || "storage/uploads",
    );
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(
      /* turbopackIgnore: true */ path.join(folder, key),
      data,
    );
  }
  return driver;
}
export async function readFile(driver: string, key: string) {
  if (!/^[a-zA-Z0-9._-]+$/.test(key)) throw new Error("Invalid storage key");
  if (driver === "r2") {
    const r = await r2().send(
      new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }),
    );
    if (!r.Body) throw new Error("Not found");
    return Buffer.from(await r.Body.transformToByteArray());
  }
  return fs.readFile(
    /* turbopackIgnore: true */ path.join(
      path.resolve(
        /* turbopackIgnore: true */ process.env.UPLOAD_DIR || "storage/uploads",
      ),
      key,
    ),
  );
}
