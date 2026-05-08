import { NextResponse } from "next/server";
import { getRoboCoreClient, isRoboCoreConfigured } from "@/lib/robocore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { course_title, parent_name, phone, email, student_name, school, notes } = body;

    if (!course_title || !parent_name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── 1. Forward to RoboCore Supabase ────────────────────────────────────
    let robocoreId: string | undefined;
    if (isRoboCoreConfigured()) {
      try {
        const rc = getRoboCoreClient();
        const { data, error } = await rc
          .from("website_course_inquiries")
          .insert({
            course_title,
            parent_name,
            parent_phone: phone,
            parent_email: email || null,
            student_name: student_name || null,
            school: school || null,
            notes: notes || null,
          })
          .select("id")
          .single();
        if (error) {
          console.error("[robocore] Course inquiry insert error:", error.message);
        } else {
          robocoreId = data?.id;
        }
      } catch (rcErr) {
        console.error("[robocore] Course inquiry forward failed:", rcErr);
      }
    }

    // ── 2. Local JSON fallback ──────────────────────────────────────────────
    const { addCourseInquiry } = await import("@/lib/localdb");
    const inquiry = await addCourseInquiry({
      name: parent_name,
      email: email || "",
      phone,
      course_title,
      school: school || student_name || "",
      message: notes || "",
    });

    return NextResponse.json({ success: true, id: robocoreId ?? inquiry.id });
  } catch (err) {
    console.error("Course inquiry error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
