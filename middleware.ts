import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET_KEY = process.env.ADMIN_SECRET;

if (!SECRET_KEY) {
  console.error(
    "[middleware] CRITICAL: ADMIN_SECRET environment variable is not set. " +
      "Admin routes will not be properly protected. Set ADMIN_SECRET in your environment."
  );
}

async function verifySessionToken(token: string): Promise<boolean> {
  const secret = SECRET_KEY || "";
  if (!secret) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [timestamp, hmac] = parts;
    const age = Date.now() - parseInt(timestamp, 10);
    if (isNaN(age) || age > 24 * 60 * 60 * 1000 || age < 0) return false;

    // Use Web Crypto API for HMAC-SHA256
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(timestamp)
    );

    // Convert signature to hex string
    const expected = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Timing-safe comparison (check length first, then compare each character)
    if (hmac.length !== expected.length) return false;
    let result = 0;
    for (let i = 0; i < hmac.length; i++) {
      result |= hmac.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes, but not login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session")?.value ?? "";
    if (!(await verifySessionToken(session))) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
