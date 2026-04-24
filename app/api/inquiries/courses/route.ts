import { NextResponse } from "next/server";
import { addCourseInquiry } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { course_title, parent_name, phone, email, student_name, school, notes } = body;

    if (!course_title || !parent_name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const inquiry = addCourseInquiry({
      name: parent_name,
      email: email || "",
      phone,
      course_title,
      school: school || student_name || "",
      message: notes || "",
    });

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error("Course inquiry error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
