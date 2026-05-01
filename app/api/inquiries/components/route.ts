import { NextResponse } from "next/server";
import { addComponentInquiry } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const inquiry = await addComponentInquiry({
      name: body.name,
      phone: body.phone,
      email: body.email || "",
      notes: body.notes || "",
      items: JSON.stringify(body.items || []),
      total_usd: body.total_usd || 0,
    });

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error("Component inquiry error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
