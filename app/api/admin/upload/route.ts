import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/db";
import { saveUploadedFile } from "@/lib/admin/content-manager";

function auth(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value ?? "";
  return isValidAdminSession(token);
}

export async function POST(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const category = (formData.get("category") as string) || "gallery";

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const results = [];
    for (const file of files) {
      const url = await saveUploadedFile(file, category);
      results.push({ name: file.name, url, size: file.size });
    }
    return NextResponse.json({ success: true, files: results });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
