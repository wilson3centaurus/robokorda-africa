import { NextResponse } from "next/server";
import { getRoboCoreClient, isRoboCoreConfigured } from "@/lib/robocore";

type RawItem = {
  id?: string;
  component_id?: string;
  name?: string;
  component_name?: string;
  qty?: number;
  priceUSD?: number;
  unit_price_usd?: number;
  priceZWG?: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, notes, items: rawItems, total_usd } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    // Normalise item shape to what the RoboCore table expects
    const items = (rawItems as RawItem[] ?? []).map((item) => ({
      id: item.id ?? item.component_id ?? "",
      name: item.name ?? item.component_name ?? "",
      qty: item.qty ?? 1,
      priceUSD: item.priceUSD ?? item.unit_price_usd ?? 0,
      priceZWG: item.priceZWG ?? 0,
    }));

    // ── 1. Forward to RoboCore Supabase ────────────────────────────────────
    let robocoreId: string | undefined;
    if (isRoboCoreConfigured()) {
      try {
        const rc = getRoboCoreClient();
        const { data, error } = await rc
          .from("website_component_inquiries")
          .insert({
            buyer_name: name,
            buyer_phone: phone,
            buyer_email: email || null,
            notes: notes || null,
            items,
            total_usd: Number(total_usd) || 0,
          })
          .select("id")
          .single();
        if (error) {
          console.error("[robocore] Component inquiry insert error:", error.message);
        } else {
          robocoreId = data?.id;
        }
      } catch (rcErr) {
        console.error("[robocore] Component inquiry forward failed:", rcErr);
      }
    }

    // ── 2. Local JSON fallback ──────────────────────────────────────────────
    const { addComponentInquiry } = await import("@/lib/localdb");
    const inquiry = await addComponentInquiry({
      name,
      phone,
      email: email || "",
      notes: notes || "",
      items: JSON.stringify(rawItems || []),
      total_usd: Number(total_usd) || 0,
    });

    return NextResponse.json({ success: true, id: robocoreId ?? inquiry.id });
  } catch (err) {
    console.error("Component inquiry error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
