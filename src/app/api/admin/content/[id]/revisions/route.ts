import { currentAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await currentAdmin())) return new Response(null, { status: 401 });
  const { id } = await params;
  const rows = await query<
    { version: number; document: unknown; savedAt: string }[]
  >(
    "SELECT version,document,saved_at AS savedAt FROM content_revisions WHERE content_id=? ORDER BY version DESC LIMIT 20",
    [id],
  );
  return Response.json(
    rows.map((r) => ({
      ...r,
      document:
        typeof r.document === "string" ? JSON.parse(r.document) : r.document,
    })),
    { headers: { "Cache-Control": "no-store" } },
  );
}
