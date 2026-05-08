import { NextResponse } from "next/server";
import { addRircRegistration } from "@/lib/localdb";
import { getRoboCoreClient, isRoboCoreConfigured } from "@/lib/robocore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      country, city, category, school, teamName, teamLead,
      email, whatsapp, members, team_members, teaserEntered, teaserLinks,
    } = body;

    if (!teamName || !school || !email || !country || !category) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    // team_members is now an array of { name, dob } objects from the updated form
    const membersArr: { name: string; dob?: string }[] = Array.isArray(team_members)
      ? team_members.filter((m: unknown) => m && typeof m === 'object' && (m as Record<string, unknown>).name)
      : [];

    // ── 1. Forward to RoboCore Supabase (primary) ──────────────────────────
    let robocoreId: string | undefined;
    if (isRoboCoreConfigured()) {
      try {
        const rc = getRoboCoreClient();
        const { data, error } = await rc
          .from("website_rirc_registrations")
          .insert({
            team_name: teamName,
            school,
            country,
            category,
            team_lead: teamLead || email,
            email,
            phone: whatsapp || "",
            members: membersArr.length || null,
            team_members: membersArr.length > 0 ? membersArr : null,
            teaser_entered: !!teaserEntered,
            teaser_links: Array.isArray(teaserLinks) ? teaserLinks.filter(Boolean) : [],
            message: [
              city ? `City: ${city}` : "",
              body.notes || "",
            ].filter(Boolean).join(" | ") || null,
          })
          .select("id")
          .single();
        if (error) {
          console.error("[robocore] RIRC insert error:", error.message);
        } else {
          robocoreId = data?.id;
        }
      } catch (rcErr) {
        console.error("[robocore] RIRC forward failed:", rcErr);
      }
    }

    // ── 2. Local JSON fallback (always write for local backup) ─────────────
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
    });

    return NextResponse.json({ success: true, id: robocoreId ?? registration.id });
  } catch (err) {
    console.error("RIRC registration error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
