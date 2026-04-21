import type { Metadata } from "next";
import { PrimeBookPageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Prime Book — Affordable Laptops for African Students & Schools",
  description:
    "Prime Book laptops built for Africa. Rugged, affordable, education-focused — Neo, WiFi, 4G, and Pro models. Contact our team to order.",
};

export default function PrimeBookPage() {
  return <PrimeBookPageClient />;
}
