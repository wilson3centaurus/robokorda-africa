import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSettings, isValidAdminSession } from "@/lib/db";

function auth(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value ?? "";
  return isValidAdminSession(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getAllSettings());
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  setSettings(body);
  return NextResponse.json({ success: true });
}
