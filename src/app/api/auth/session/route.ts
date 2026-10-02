import { currentAdmin } from "@/lib/auth";

export async function GET() {
  const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
  try {
    const admin = await currentAdmin();
    return Response.json(
      { authenticated: !!admin, expiresAt: admin?.expiresAt ?? null },
      { headers },
    );
  } catch {
    return Response.json({ authenticated: false }, { status: 503, headers });
  }
}
