import { randomUUID } from "node:crypto";
import { currentAdmin, sameOrigin } from "@/lib/auth";
import { contents } from "@/lib/content";
import { query } from "@/lib/db";
import { emptyTranslation } from "@/lib/types";
export async function GET() {
  if (!(await currentAdmin())) return new Response(null, { status: 401 });
  return Response.json(await contents(undefined, true));
}
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return new Response(null, { status: 403 });
  const { kind } = await req.json();
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
    };
  await query(
    "INSERT INTO content(id,kind,slug,status,document) VALUES (?,?,?,?,?)",
    [id, kind, c.slug, "draft", JSON.stringify(c)],
  );
  return Response.json({ id });
}
