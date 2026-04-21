import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("website_component_inquiries").insert({
      buyer_name: body.name,
      buyer_phone: body.phone,
      buyer_email: body.email || null,
      notes: body.notes || null,
      items: body.items,
      total_usd: body.total_usd,
      status: "new",
    });

    if (error) {
      console.error("Component inquiry insert error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Component inquiry API error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
