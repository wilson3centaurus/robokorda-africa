import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

const SECRET_KEY = process.env.ADMIN_SECRET;

if (!SECRET_KEY) {
  // In Next.js middleware this runs at edge, so we use console
  console.error(
    "[middleware] CRITICAL: ADMIN_SECRET environment variable is not set. " +
      "Admin routes will not be properly protected. Set ADMIN_SECRET in your environment."
  );
}

function verifySessionToken(token: string): boolean {
  const secret = SECRET_KEY || "";
  if (!secret) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [timestamp, hmac] = parts;
    const age = Date.now() - parseInt(timestamp, 10);
    if (isNaN(age) || age > 24 * 60 * 60 * 1000 || age < 0) return false;
    const expected = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes, but not login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session")?.value ?? "";
    if (!verifySessionToken(session)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
