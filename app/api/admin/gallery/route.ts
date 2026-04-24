import { NextRequest, NextResponse } from "next/server";
import { getAllGallery, upsertGallery, deleteGallery, isValidAdminSession } from "@/lib/db";

function auth(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value ?? "";
  return isValidAdminSession(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getAllGallery());
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const row = upsertGallery(body);
  return NextResponse.json(row);
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  deleteGallery(id);
  return NextResponse.json({ success: true });
}
