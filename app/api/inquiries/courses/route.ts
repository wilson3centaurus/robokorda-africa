import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { course_title, parent_name, phone, email, student_name, school, notes } = body;

    if (!course_title || !parent_name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("website_course_inquiries").insert({
      course_title,
      parent_name,
      parent_phone: phone,
      parent_email: email || null,
      student_name: student_name || null,
      school: school || null,
      notes: notes || null,
      status: "new",
    });

    if (error) {
      console.error("Course inquiry insert error:", error);
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Course inquiry error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
