import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("website_rirc_registrations").insert({
      team_name: body.teamName,
      school: body.school,
      country: body.country,
      category: body.category,
      team_lead: body.teamLead,
      email: body.email || null,
      phone: body.phone,
      members: body.members || null,
      message: body.message || null,
      status: "pending",
    });

    if (error) {
      console.error("RIRC registration insert error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RIRC registration API error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
