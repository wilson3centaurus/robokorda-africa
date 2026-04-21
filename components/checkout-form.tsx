"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ShieldCheck, Truck, Zap } from "lucide-react";
import { Card } from "@/components/card";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/providers/cart-provider";

type CheckoutState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
};

const initialState: CheckoutState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  deliveryMethod: "Standard",
  paymentMethod: "EcoCash",
};

export function CheckoutForm() {
  const { items, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [orderReference, setOrderReference] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setOrderReference(`RK-AF-${Math.floor(1000 + Math.random() * 9000)}`);
    clearCart();
    setForm(initialState);
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="section-shell section-space">
        <Card className="text-center">
          <h1 className="text-4xl font-semibold text-brand-ink">
            Your cart is currently empty.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-brand-muted">
            Add products from the shop before moving to checkout.
          </p>
          <div className="mt-8">
            <Link href="/shop" className="btn-primary">
              Visit the shop
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="section-shell section-space">
      <div className="grid gap-10 xl:grid-cols-[1.5fr_0.85fr]">
        <Card>
          {submitted ? (
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-cloud text-brand-blue">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </span>
              <h1 className="mt-6 text-4xl font-semibold text-brand-ink">
                Checkout submitted
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-brand-muted">
                Your order request has been captured on the front end. Reference:
                {" "}
                <span className="font-semibold text-brand-ink">{orderReference}</span>
              </p>
              <div className="mt-8">
                <Link href="/shop" className="btn-primary">
                  Continue browsing
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
                  Checkout
                </p>
                <h1 className="mt-3 text-4xl font-semibold text-brand-ink">
                  Confirm your order request.
                </h1>
                <p className="mt-4 text-base leading-8 text-brand-muted">
                  Submit your details and Robokorda Africa will follow up to
                  confirm delivery, availability, and final order processing.
                </p>
              </div>
              <div className="mb-8 flex flex-wrap gap-3">
                <span className="trust-chip">
                  <ShieldCheck className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                  Secure
                </span>
                <span className="trust-chip">
                  <Truck className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                  Fast Delivery
                </span>
                <span className="trust-chip">
                  <Zap className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                  1-Year Warranty
                </span>
              </div>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="field-label">Name</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, name: event.target.value }))
                      }
                      className="field-input"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="field-label">Email</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, email: event.target.value }))
                      }
                      className="field-input"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="field-label">Phone</span>
                    <input
                      required
                      value={form.phone}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, phone: event.target.value }))
                      }
                      className="field-input"
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="field-label">Address</span>
                    <textarea
                      required
                      value={form.address}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          address: event.target.value,
                        }))
                      }
                      className="field-textarea"
                    />
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="field-label">Delivery Method</span>
                    <select
                      value={form.deliveryMethod}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          deliveryMethod: event.target.value,
                        }))
                      }
                      className="field-select"
                    >
                      <option>Standard</option>
                      <option>Express</option>
                      <option>Pickup</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="field-label">Payment Method</span>
                    <select
                      value={form.paymentMethod}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          paymentMethod: event.target.value,
                        }))
                      }
                      className="field-select"
                    >
                      <option>EcoCash</option>
                      <option>Bank Transfer</option>
                      <option>Card</option>
                      <option>Cash</option>
                    </select>
                  </label>
                </div>
                <button type="submit" className="btn-primary">
                  Place Order
                </button>
              </form>
            </>
          )}
        </Card>
        {!submitted ? <CartSummary className="xl:sticky xl:top-28" compact /> : null}
      </div>
    </div>
  );
}
