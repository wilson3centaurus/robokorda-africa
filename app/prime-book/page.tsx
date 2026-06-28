export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { PrimeBookPageClient } from "./page-client";

export const metadata: Metadata = buildMetadata({
  title: "Prime Book Affordable Student Laptops for African Schools",
  description:
    "Explore Prime Book student laptops built for African schools and families. Compare Neo, WiFi, 4G, and Pro models designed for affordable digital learning.",
  path: "/prime-book",
  keywords: [
    "student laptops Africa",
    "school laptops Zimbabwe",
    "Prime Book laptop",
    "affordable laptops for schools",
  ],
  image: "/images/primebooks/primebook-2-pro.jpg",
});

export default async function PrimeBookPage() {
  const settings = await getSiteSettings();
  return <PrimeBookPageClient videoUrl={settings.video_url_primebook || "/media/primebooks.mp4"} />;
}
