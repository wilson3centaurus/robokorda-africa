import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Submit your Robokorda Africa order request and confirm delivery details for your selected resources.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
