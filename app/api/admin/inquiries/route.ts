import { NextRequest, NextResponse } from "next/server";
import {
  getRircRegistrations, getComponentInquiries, getCourseInquiries,
  getPrimebookInquiries, getContactMessages, isValidAdminSession,
  updateRircStatus, updateRircFlags, updateInquiryFlags,
} from "@/lib/db";

function auth(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value ?? "";
  return isValidAdminSession(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "all";

  const data: Record<string, unknown> = {};
  if (type === "all" || type === "rirc") data.rirc = getRircRegistrations();
  if (type === "all" || type === "components") data.components = getComponentInquiries();
  if (type === "all" || type === "courses") data.courses = getCourseInquiries();
  if (type === "all" || type === "primebook") data.primebook = getPrimebookInquiries();
  if (type === "all" || type === "contact") data.contact = getContactMessages();

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, type, status, flags } = await req.json();

  if (flags) {
    if (type === "rirc") updateRircFlags(id, flags);
    else updateInquiryFlags(`${type}_inquiries`, id, flags);
  } else if (status) {
    if (type === "rirc") updateRircStatus(id, status);
    else updateInquiryFlags(`${type}_inquiries`, id, { status });
  }

  return NextResponse.json({ success: true });
}
