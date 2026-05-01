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
  const fetches: Promise<void>[] = [];

  if (type === "all" || type === "rirc")
    fetches.push(getRircRegistrations().then((v) => { data.rirc = v; }));
  if (type === "all" || type === "components")
    fetches.push(getComponentInquiries().then((v) => { data.components = v; }));
  if (type === "all" || type === "courses")
    fetches.push(getCourseInquiries().then((v) => { data.courses = v; }));
  if (type === "all" || type === "primebook")
    fetches.push(getPrimebookInquiries().then((v) => { data.primebook = v; }));
  if (type === "all" || type === "contact")
    fetches.push(getContactMessages().then((v) => { data.contact = v; }));

  await Promise.all(fetches);
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, type, status, flags } = await req.json();

  if (flags) {
    if (type === "rirc") await updateRircFlags(id, flags);
    else await updateInquiryFlags(`${type}_inquiries`, id, flags);
  } else if (status) {
    if (type === "rirc") await updateRircStatus(id, status);
    else await updateInquiryFlags(`${type}_inquiries`, id, { status });
  }

  return NextResponse.json({ success: true });
}
