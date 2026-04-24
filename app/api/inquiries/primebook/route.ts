import { NextResponse } from "next/server";
import { addPrimebookInquiry } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const inquiry = addPrimebookInquiry({
      name: body.name,
      email: body.email || "",
      phone: body.phone,
      quantity: body.quantity || 1,
      school: body.school || "",
      message: body.notes || "",
    });

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error("Primebook inquiry error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
