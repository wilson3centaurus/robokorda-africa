import { NextRequest, NextResponse } from "next/server";
import { getSetting, createAdminSession, deleteAdminSession, isValidAdminSession } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const adminPassword = getSetting("admin_password", "robokorda2026");
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = createAdminSession();
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value ?? "";
  return NextResponse.json({ authenticated: isValidAdminSession(token) });
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value ?? "";
  if (token) deleteAdminSession(token);
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
