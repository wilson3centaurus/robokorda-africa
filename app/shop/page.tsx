export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop-page-client";
import { getComponents } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse robotics kits, electronics resources, and coding materials curated for schools, parents, and education partners.",
};

export default async function ShopPage() {
  const components = await getComponents();
  return <ShopPageClient initialComponents={components} />;
}
