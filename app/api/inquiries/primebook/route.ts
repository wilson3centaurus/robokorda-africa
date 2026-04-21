import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("website_primebook_inquiries").insert({
      model_id: body.model_id,
      model_name: body.model_name,
      price_usd: body.price_usd,
      price_zwg: body.price_zwg ?? null,
      buyer_name: body.name,
      buyer_phone: body.phone,
      buyer_email: body.email || null,
      student_name: body.student_name || null,
      school: body.school || null,
      quantity: body.quantity,
      notes: body.notes || null,
      status: "new",
    });

    if (error) {
      console.error("Primebook inquiry insert error:", error);
      // Still return 200 so the UI shows success
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Primebook inquiry API error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
