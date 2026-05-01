"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ShieldCheck, Truck, Zap } from "lucide-react";
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

const inputCls = "w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]";
const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]";

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
        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-10 text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Your cart is currently empty.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
            Add products from the shop before moving to checkout.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="btn-primary"
            >
              Visit the shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell section-space">
      <div className="grid gap-8 xl:grid-cols-[1.5fr_0.85fr]">
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6 sm:p-8">
          {submitted ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.30)] bg-[rgba(0,229,160,0.10)]">
                <CheckCircle2 className="h-7 w-7 text-[var(--neon)]" aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-3xl font-bold text-[var(--text-primary)]">Order submitted!</h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                Your order request has been captured. Reference:{" "}
                <span className="font-bold text-[var(--neon)]">{orderReference}</span>
              </p>
              <div className="mt-8">
                <Link
                  href="/shop"
                  className="btn-primary"
                >
                  Continue browsing
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--electric-bright)]">Checkout</p>
                <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Confirm your order request.</h1>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Submit your details and Robokorda Africa will follow up to confirm delivery, availability, and final order processing.
                </p>
              </div>
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  { icon: ShieldCheck, label: "Secure" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Zap, label: "1-Year Warranty" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-3 py-1 text-xs font-semibold text-[var(--electric-bright)]">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className={labelCls}>Name</span>
                    <input required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className={inputCls} placeholder="Full name" />
                  </label>
                  <label className="space-y-1.5">
                    <span className={labelCls}>Email</span>
                    <input required type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className={inputCls} placeholder="you@example.com" />
                  </label>
                  <label className="space-y-1.5">
                    <span className={labelCls}>Phone</span>
                    <input required value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className={inputCls} placeholder="+263 ..." />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <span className={labelCls}>Address</span>
                    <textarea required rows={3} value={form.address} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} className={`${inputCls} resize-none`} placeholder="Delivery address" />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className={labelCls}>Delivery Method</span>
                    <select value={form.deliveryMethod} onChange={(e) => setForm((s) => ({ ...s, deliveryMethod: e.target.value }))} className={inputCls}>
                      <option>Standard</option>
                      <option>Express</option>
                      <option>Pickup</option>
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className={labelCls}>Payment Method</span>
                    <select value={form.paymentMethod} onChange={(e) => setForm((s) => ({ ...s, paymentMethod: e.target.value }))} className={inputCls}>
                      <option>EcoCash</option>
                      <option>Bank Transfer</option>
                      <option>Card</option>
                      <option>Cash</option>
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Place Order
                </button>
              </form>
            </>
          )}
        </div>
        {!submitted && <CartSummary className="xl:sticky xl:top-28" compact />}
      </div>
    </div>
  );
}
