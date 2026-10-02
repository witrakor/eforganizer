import { currentAdmin, sameOrigin } from "@/lib/auth";
import { query } from "@/lib/db";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(req) || !(await currentAdmin()))
    return new Response(null, { status: 403 });
  const { id } = await params;
  const { status } = await req.json();
  if (!["new", "contacted", "closed", "archived"].includes(status))
    return new Response(null, { status: 400 });
  await query("UPDATE inquiries SET status=? WHERE id=?", [status, id]);
  return Response.json({ ok: true });
}
