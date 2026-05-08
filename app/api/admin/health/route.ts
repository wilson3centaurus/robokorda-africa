import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = getServerClient();
  const checks: Record<string, string> = {};

  // Test settings table
  const { data: settings, error: settingsErr } = await sb
    .from("settings")
    .select("key")
    .limit(1);
  checks.settings = settingsErr ? `ERROR: ${settingsErr.message}` : `OK (${settings?.length ?? 0} rows sampled)`;

  // Test gallery table
  const { data: gallery, error: galleryErr } = await sb
    .from("gallery")
    .select("id")
    .limit(1);
  checks.gallery = galleryErr ? `ERROR: ${galleryErr.message}` : `OK (${gallery?.length ?? 0} rows sampled)`;

  // Test page_content table
  const { data: pageContent, error: pageContentErr } = await sb
    .from("page_content")
    .select("page")
    .limit(1);
  checks.page_content = pageContentErr ? `ERROR: ${pageContentErr.message}` : `OK (${pageContent?.length ?? 0} rows sampled)`;

  // Test courses table
  const { data: courses, error: coursesErr } = await sb
    .from("courses")
    .select("seed")
    .limit(1);
  checks.courses = coursesErr ? `ERROR: ${coursesErr.message}` : `OK (${courses?.length ?? 0} rows sampled)`;

  const allOk = Object.values(checks).every((v) => v.startsWith("OK"));

  return NextResponse.json(
    { status: allOk ? "ok" : "degraded", checks, supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL },
    { status: allOk ? 200 : 503 },
  );
}
