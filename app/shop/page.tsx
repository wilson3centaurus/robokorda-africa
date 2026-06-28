export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop-page-client";
import { getComponents } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Robotics Kits, STEM Devices and Learning Tools",
  description:
    "Browse Robokorda Africa robotics kits, STEM devices, electronics resources, and coding tools for schools, parents, and education partners.",
  path: "/shop",
  keywords: [
    "robotics kits Zimbabwe",
    "STEM shop Africa",
    "coding kits for schools",
    "educational electronics",
  ],
  image: "/images/shop/robokorda-robotics-kit.jpg",
});

export default async function ShopPage() {
  const components = await getComponents();
  return <ShopPageClient initialComponents={components} />;
}
