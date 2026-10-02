import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { currentAdmin, sameOrigin } from "@/lib/auth";
import { mediaList } from "@/lib/content";
import { storeFile } from "@/lib/storage";
import { query } from "@/lib/db";
export const runtime = "nodejs";
export async function GET() {
  if (!(await currentAdmin())) return new Response(null, { status: 401 });
  return Response.json(await mediaList(true));
}
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return new Response(null, { status: 403 });
  if (Number(req.headers.get("content-length") || 0) > 13 * 1024 * 1024)
    return Response.json({ error: "ไฟล์ต้องไม่เกิน 12 MB" }, { status: 413 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 12 * 1024 * 1024 ||
      file.size === 0
    )
      return Response.json(
        { error: "เลือกไฟล์ขนาดไม่เกิน 12 MB" },
        { status: 400 },
      );
    const isImage = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ].includes(file.type),
      isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf)
      return Response.json(
        { error: "รองรับ JPG, PNG, WebP, AVIF และ PDF" },
        { status: 400 },
      );
    let data = Buffer.from(await file.arrayBuffer());
    let mime = file.type,
      ext = "pdf";
    if (isImage) {
      data = Buffer.from(
        await sharp(data, { limitInputPixels: 40_000_000 })
          .rotate()
          .resize({
            width: 2400,
            height: 2400,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 86 })
          .toBuffer(),
      );
      mime = "image/webp";
      ext = "webp";
    } else if (data.subarray(0, 5).toString() !== "%PDF-")
      return Response.json({ error: "ไฟล์ PDF ไม่ถูกต้อง" }, { status: 400 });
    const id = randomUUID(),
      key = `${id}.${ext}`;
    const driver = await storeFile(key, data, mime);
    const url = `/api/media/${id}`;
    await query(
      "INSERT INTO media(id,name,url,mime,size,alt,source,driver,storage_key) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        id,
        file.name.slice(0, 255),
        url,
        mime,
        data.length,
        "",
        "",
        driver,
        key,
      ],
    );
    return Response.json({ id, url });
  } catch (e) {
    console.error("Media upload failed:", (e as Error).message);
    return Response.json(
      { error: "อัปโหลดไม่สำเร็จ ตรวจชนิดไฟล์หรือการตั้งค่า Storage" },
      { status: 500 },
    );
  }
}
