import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cart",
  description:
    "Review the Robokorda Africa items selected for your school, learner, or programme order.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return <CartPageClient />;
}
