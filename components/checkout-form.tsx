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

const inputCls = "w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[rgba(0,102,255,0.3)]";
const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]";

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
        <div className="rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(7,20,40,0.8)] p-10 text-center">
          <h1 className="text-3xl font-bold text-white">Your cart is currently empty.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#4d7499]">
            Add products from the shop before moving to checkout.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc]"
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
        <div className="rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(7,20,40,0.8)] p-6 sm:p-8">
          {submitted ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)]">
                <CheckCircle2 className="h-7 w-7 text-[#00e5a0]" aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-3xl font-bold text-white">Order submitted!</h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#4d7499]">
                Your order request has been captured. Reference:{" "}
                <span className="font-bold text-[#00e5a0]">{orderReference}</span>
              </p>
              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc]"
                >
                  Continue browsing
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0066ff]">Checkout</p>
                <h1 className="mt-2 text-2xl font-bold text-white">Confirm your order request.</h1>
                <p className="mt-3 text-sm leading-7 text-[#4d7499]">
                  Submit your details and Robokorda Africa will follow up to confirm delivery, availability, and final order processing.
                </p>
              </div>
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  { icon: ShieldCheck, label: "Secure" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Zap, label: "1-Year Warranty" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.06)] px-3 py-1 text-xs font-semibold text-[#7eb8ff]">
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
                    <input required value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className={inputCls} placeholder="+27 or +263" />
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
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc]"
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
