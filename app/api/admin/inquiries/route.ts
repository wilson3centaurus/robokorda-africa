import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/db";
import {
  getRircRegistrations, getComponentInquiries, getCourseInquiries,
  getPrimebookInquiries, getContactMessages,
  updateRircStatus, updateRircFlags, updateInquiryFlags, getShopOrders,
} from "@/lib/localdb";

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
  if (type === "all" || type === "orders") data.orders = getShopOrders();

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, type, status, flags } = await req.json();

  const fileMap: Record<string, string> = {
    components: "component_inquiries.json",
    courses: "course_inquiries.json",
    primebook: "primebook_inquiries.json",
    contact: "contact_messages.json",
    orders: "shop_orders.json",
  };

  if (flags) {
    if (type === "rirc") updateRircFlags(id, flags);
    else if (fileMap[type]) updateInquiryFlags(fileMap[type], id, flags);
  } else if (status) {
    if (type === "rirc") updateRircStatus(id, status);
    else if (fileMap[type]) updateInquiryFlags(fileMap[type], id, { status });
  }

  return NextResponse.json({ success: true });
}
