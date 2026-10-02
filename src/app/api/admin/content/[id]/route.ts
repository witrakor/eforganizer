import { currentAdmin, sameOrigin } from "@/lib/auth";
import { contentById } from "@/lib/content";
import { pool } from "@/lib/db";
import { contentSchema } from "@/lib/validation";
import { isSystemPage } from "@/lib/admin-content";
const fixed = [
  "home",
  "about",
  "services",
  "work",
  "journal",
  "contact",
  "privacy",
];
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return new Response(null, { status: 403 });
  const { id } = await params;
  try {
    const parsed = contentSchema.safeParse(await req.json());
    if (!parsed.success)
      return Response.json(
        { error: parsed.error.issues.map((i) => i.message).join(" · ") },
        { status: 400 },
      );
    const c = parsed.data;
    const existing = await contentById(id);
    if (!existing) return new Response(null, { status: 404 });
    if (c.id !== id || c.kind !== existing.kind)
      return new Response(null, { status: 400 });
    if (
      existing.kind === "page" &&
      fixed.includes(existing.slug) &&
      (c.slug !== existing.slug || c.status !== "published")
    )
      return Response.json(
        { error: "หน้าหลักของระบบต้องเผยแพร่และใช้ URL เดิม" },
        { status: 400 },
      );
    const { version, ...document } = c;
    if (!version)
      return Response.json(
        { error: "Reload content before saving" },
        { status: 409 },
      );
    const connection = await pool().getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute(
        "SELECT document, version FROM content WHERE id=? AND status <> 'deleted' FOR UPDATE",
        [id],
      );
      const previous = (rows as { document: unknown; version: number }[])[0];
      if (!previous || previous.version !== version) {
        await connection.rollback();
        return Response.json(
          { error: "ข้อมูลถูกแก้ไขจากอีกหน้าต่าง กรุณาโหลดใหม่ก่อนบันทึก" },
          { status: 409 },
        );
      }
      await connection.execute(
        "INSERT IGNORE INTO content_revisions(content_id,version,document) VALUES (?,?,?)",
        [
          id,
          version,
          typeof previous.document === "string"
            ? previous.document
            : JSON.stringify(previous.document),
        ],
      );
      await connection.execute(
        "UPDATE content SET slug=?,status=?,document=?,version=version+1 WHERE id=? AND version=?",
        [c.slug, c.status, JSON.stringify(document), id, version],
      );
      await connection.execute(
        "DELETE FROM content_revisions WHERE content_id=? AND version < ?",
        [id, Math.max(0, version - 19)],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return Response.json({ ok: true, version: version + 1 });
  } catch (e) {
    if ((e as { code?: string }).code === "ER_DUP_ENTRY")
      return Response.json(
        { error: "URL นี้ถูกใช้งานแล้ว กรุณาเปลี่ยน slug" },
        { status: 409 },
      );
    return Response.json(
      { error: "บันทึกไม่สำเร็จ กรุณาลองใหม่" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return Response.json(
      { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง" },
      { status: 403 },
    );
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!Number.isInteger(body?.version) || body.version < 1)
    return Response.json(
      { error: "กรุณาโหลดเนื้อหาใหม่ก่อนลบ" },
      { status: 400 },
    );
  const connection = await pool().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      "SELECT kind,slug,version FROM content WHERE id=? AND status <> 'deleted' FOR UPDATE",
      [id],
    );
    const existing = (
      rows as { kind: string; slug: string; version: number }[]
    )[0];
    if (!existing) {
      await connection.rollback();
      return Response.json(
        { error: "ไม่พบเนื้อหานี้ หรือถูกลบไปแล้ว" },
        { status: 404 },
      );
    }
    if (isSystemPage(existing)) {
      await connection.rollback();
      return Response.json(
        { error: "ไม่สามารถลบหน้าหลักของระบบได้" },
        { status: 400 },
      );
    }
    if (existing.version !== body.version) {
      await connection.rollback();
      return Response.json(
        { error: "เนื้อหาถูกแก้ไขจากอีกหน้าต่าง กรุณาโหลดใหม่ก่อนลบ" },
        { status: 409 },
      );
    }
    // Keep a tombstone so startup seeding cannot recreate deleted content.
    // Preserve the document, revisions and shared media without exposing the row.
    await connection.execute(
      "UPDATE content SET status='deleted',version=version+1 WHERE id=?",
      [id],
    );
    await connection.commit();
    return Response.json({ ok: true });
  } catch {
    await connection.rollback();
    return Response.json(
      { error: "ลบเนื้อหาไม่สำเร็จ กรุณาลองใหม่" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
}
