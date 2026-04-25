import { NextRequest, NextResponse } from "next/server";
import { getCourses, updateCourse, isValidAdminSession } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get("admin_session")?.value || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getCourses());
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get("admin_session")?.value || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const updated = updateCourse(body.seed, body);
  return NextResponse.json(updated);
}
