import { NextResponse } from "next/server";
import { addRircRegistration } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, school, country, category, teamLead, email, phone, message } = body;

    if (!teamName || !school || !email || !phone || !teamLead) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const registration = addRircRegistration({
      school_name: school,
      team_name: teamName,
      contact_name: teamLead,
      email,
      phone,
      country: country || "Zimbabwe",
      track: category || "Junior",
      team_size: body.teamSize || "4",
      notes: message || "",
    });

    return NextResponse.json({ success: true, id: registration.id });
  } catch (err) {
    console.error("RIRC registration error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
