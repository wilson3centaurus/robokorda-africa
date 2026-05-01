import { NextResponse } from "next/server";
import { addRircRegistration } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      country, city, category, school, teamName, teamLead,
      email, whatsapp, members, team_members,
      video_challenge_entered, video_challenge_links,
    } = body;

    if (!teamName || !school || !email || !country || !category) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const membersArr = team_members ?? (members
      ? members.map((m: { name: string } | string) => typeof m === "string" ? m : m.name)
      : []);

    const registration = await addRircRegistration({
      school_name: school,
      team_name: teamName,
      contact_name: teamLead || email,
      email,
      phone: whatsapp || "",
      whatsapp: whatsapp || "",
      country,
      city: city || "",
      track: category,
      category,
      team_size: String(membersArr.length),
      team_members: JSON.stringify(membersArr),
      notes: body.notes || "",
      video_challenge_entered: Boolean(video_challenge_entered),
      video_challenge_links: video_challenge_links || "",
    });

    return NextResponse.json({ success: true, id: registration.id });
  } catch (err) {
    console.error("RIRC registration error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
