import { adminContentHref } from "@/lib/admin-content-url";
import { randomUUID } from "node:crypto";
import { currentAdmin, sameOrigin } from "@/lib/auth";
import { contents } from "@/lib/content";
import { query } from "@/lib/db";
import { catalogServices, serviceCategory } from "@/lib/service-catalog";
import { emptyTranslation } from "@/lib/types";
export async function GET() {
  if (!(await currentAdmin())) return new Response(null, { status: 401 });
  return Response.json(await contents(undefined, true));
}
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return new Response(null, { status: 403 });
  const { kind, templateSlug } = await req.json();
  if (
    templateSlug !== undefined &&
    (kind !== "service" ||
      typeof templateSlug !== "string" ||
      !serviceCategory(templateSlug))
  )
    return Response.json(
      { error: "Invalid service template" },
      { status: 400 },
    );
  if (templateSlug) {
    const existing = await query<{ id: string; status: string }[]>(
      "SELECT id,status FROM content WHERE kind=? AND slug=?",
      [kind, templateSlug],
    );
    if (existing[0]?.status === "deleted")
      return Response.json(
        { error: "บริการนี้ถูกลบแล้ว กรุณาสร้างบริการใหม่ด้วย URL ใหม่" },
        { status: 409 },
      );
    if (existing.length)
      return Response.json({
        id: existing[0].id,
        href: adminContentHref({ kind, slug: templateSlug }),
      });
  }
  if (!["page", "post", "service", "project"].includes(kind))
    return Response.json({ error: "Invalid type" }, { status: 400 });
  const id = randomUUID(),
    c = {
      id,
      kind,
      slug: `new-${id.slice(0, 8)}`,
      status: "draft",
      image: "",
      gallery: [],
      category: "",
      featured: false,
      sortOrder: 100,
      date: new Date().toISOString().slice(0, 10),
      th: emptyTranslation(),
      en: emptyTranslation(),
      ...(templateSlug
        ? {
            ...catalogServices([], true).find(
              (service) => service.slug === templateSlug,
            )!,
            id,
            status: "draft",
          }
        : {}),
    };
  try {
    await query(
      "INSERT INTO content(id,kind,slug,status,document) VALUES (?,?,?,?,?)",
      [id, kind, c.slug, "draft", JSON.stringify(c)],
    );
  } catch (error) {
    if (templateSlug && (error as { code?: string }).code === "ER_DUP_ENTRY") {
      const existing = await query<{ id: string; status: string }[]>(
        "SELECT id,status FROM content WHERE kind=? AND slug=?",
        [kind, templateSlug],
      );
      if (existing[0]?.status === "deleted")
        return Response.json(
          { error: "บริการนี้ถูกลบแล้ว กรุณาสร้างบริการใหม่ด้วย URL ใหม่" },
          { status: 409 },
        );
      if (existing.length)
        return Response.json({
          id: existing[0].id,
          href: adminContentHref({ kind, slug: templateSlug }),
        });
    }
    throw error;
  }
  return Response.json({ id, href: adminContentHref(c) });
}
