import { query } from "@/lib/db";
import { readFile } from "@/lib/storage";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404 });
  const rows = await query<
    { mime: string; driver: string; storage_key: string; name: string }[]
  >(
    "SELECT mime,driver,storage_key,name FROM media WHERE id=? AND deleted_at IS NULL",
    [id],
  );
  const m = rows[0];
  if (!m || m.driver === "bundled") return new Response(null, { status: 404 });
  try {
    const data = await readFile(m.driver, m.storage_key);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": m.mime,
        "Content-Length": String(data.length),
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        ...(m.mime === "application/pdf"
          ? { "Content-Disposition": `attachment; filename="document.pdf"` }
          : {}),
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
