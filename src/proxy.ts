import { NextRequest, NextResponse } from "next/server";
export function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set(
    "x-eliteflow-locale",
    req.nextUrl.pathname.startsWith("/en") ? "en" : "th",
  );
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ["/((?!api|_next|media|favicon.ico).*)"] };
