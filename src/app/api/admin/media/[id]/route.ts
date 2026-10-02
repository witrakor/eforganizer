import { mediaUsage } from "@/lib/admin-content";
import { currentAdmin, sameOrigin } from "@/lib/auth";
import { query } from "@/lib/db";
import { contents } from "@/lib/content";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return new Response(null, { status: 403 });
  const { id } = await params;
  const data = await req.json();
  if (data.action === "trash") {
    const media = await query<{ url: string }[]>(
      "SELECT url FROM media WHERE id=?",
      [id],
    );
    if (media[0]) {
      const all = await contents(undefined, true);
      if (mediaUsage(all, media[0].url).length)
        return Response.json(
          { error: "รูปนี้ถูกใช้งานในเนื้อหา กรุณาเปลี่ยนรูปในหน้านั้นก่อน" },
          { status: 409 },
        );
    }
    await query("UPDATE media SET deleted_at=UTC_TIMESTAMP() WHERE id=?", [id]);
  } else if (data.action === "restore")
    await query("UPDATE media SET deleted_at=NULL WHERE id=?", [id]);
  else {
    if (
      typeof data.alt !== "string" ||
      typeof data.source !== "string" ||
      data.alt.length > 1000 ||
      data.source.length > 2000
    )
      return new Response(null, { status: 400 });
    await query("UPDATE media SET alt=?,source=? WHERE id=?", [
      data.alt,
      data.source,
      id,
    ]);
  }
  return Response.json({ ok: true });
}
