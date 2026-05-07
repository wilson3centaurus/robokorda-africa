import { NextResponse } from "next/server";
import { getRoboCoreClient, isRoboCoreConfigured } from "@/lib/robocore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, phone, email, student_name, school, quantity, notes,
      model_id, model_name, price_usd, price_zwg,
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    // ── 1. Forward to RoboCore Supabase ────────────────────────────────────
    let robocoreId: string | undefined;
    if (isRoboCoreConfigured()) {
      try {
        const rc = getRoboCoreClient();
        const { data, error } = await rc
          .from("website_primebook_inquiries")
          .insert({
            model_id: model_id || "primebook-standard",
            model_name: model_name || "PrimeBook",
            price_usd: Number(price_usd) || 299,
            price_zwg: Number(price_zwg) || 850000,
            buyer_name: name,
            buyer_phone: phone,
            buyer_email: email || null,
            student_name: student_name || null,
            school: school || null,
            quantity: Number(quantity) || 1,
            notes: notes || null,
          })
          .select("id")
          .single();
        if (error) {
          console.error("[robocore] Primebook insert error:", error.message);
        } else {
          robocoreId = data?.id;
        }
      } catch (rcErr) {
        console.error("[robocore] Primebook forward failed:", rcErr);
      }
    }

    // ── 2. Local JSON fallback ──────────────────────────────────────────────
    // Import lazily to avoid breaking builds when localdb has issues
    const { addPrimebookInquiry } = await import("@/lib/localdb");
    const inquiry = await addPrimebookInquiry({
      name,
      email: email || "",
      phone,
      quantity: Number(quantity) || 1,
      school: school || "",
      message: notes || "",
    });

    return NextResponse.json({ success: true, id: robocoreId ?? inquiry.id });
  } catch (err) {
    console.error("Primebook inquiry error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
