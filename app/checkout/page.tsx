import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description:
    "Submit your Robokorda Africa order request and confirm delivery details for your selected resources.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutForm />;
}
