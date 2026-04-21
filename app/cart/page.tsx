import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review the Robokorda Africa items selected for your school, learner, or programme order.",
};

export default function CartPage() {
  return <CartPageClient />;
}
