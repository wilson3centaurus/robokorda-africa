import { NextResponse } from "next/server";
import { addContactMessage } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, organisation, phone, interest, message } = body;

    if (!fullName || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const msg = addContactMessage({
      name: fullName,
      email,
      phone,
      subject: `${interest}${organisation ? ` — ${organisation}` : ""}`,
      message,
    });

    return NextResponse.json({ success: true, id: msg.id });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
