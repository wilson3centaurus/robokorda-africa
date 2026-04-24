"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { CartSummary } from "@/components/cart/cart-summary";
import { QuantityControl } from "@/components/cart/quantity-control";
import { useCart } from "@/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartPageClient() {
  const { items, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="section-shell section-space">
        <div className="rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(7,20,40,0.8)] p-10 text-center">
          <div className="mx-auto max-w-xs">
            <PlaceholderMedia
              mode="product"
              label="Empty Cart Placeholder"
              seed="empty-cart-state"
              aspectRatio="16 / 10"
            />
          </div>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.28em] text-[#0066ff]">Cart</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Your cart is empty.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#4d7499]">
            Browse the Robokorda Africa shop to add classroom resources, starter kits, and robotics components to your order.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc]"
            >
              <ShoppingBag className="h-4 w-4" />
              Return to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell section-space">
      <div className="grid gap-8 xl:grid-cols-[1.7fr_0.85fr]">
        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0066ff]">Cart</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Review your selected items.</h1>
          </div>
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[rgba(0,102,255,0.18)] bg-[rgba(7,20,40,0.8)] p-5">
              <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                <PlaceholderMedia
                  mode="product"
                  label={`${item.name} Cart Placeholder`}
                  seed={item.seed}
                  imageUrl={item.imageSrc}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066ff]">
                        {item.category}
                      </p>
                      <h2 className="mt-1.5 text-xl font-bold text-white">{item.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-[#4d7499]">{item.shortDescription}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#2a4d80] transition hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 border-t border-[rgba(0,102,255,0.12)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <QuantityControl
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.id, value)}
                    />
                    <div className="text-right">
                      <p className="text-xs text-[#4d7499]">Line total</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(0,102,255,0.25)] px-5 py-3 text-sm font-semibold text-[#7eb8ff] transition hover:border-[rgba(0,102,255,0.5)] hover:text-white"
            >
              Continue Shopping
            </Link>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
        <CartSummary className="xl:sticky xl:top-28" />
      </div>
    </div>
  );
}
