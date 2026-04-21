"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/card";
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
        <Card className="text-center">
          <div className="mx-auto max-w-md">
            <PlaceholderMedia
              mode="product"
              label="Empty Cart Placeholder"
              seed="empty-cart-state"
              aspectRatio="16 / 10"
            />
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
            Cart
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-brand-ink">
            Your cart is empty.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-brand-muted">
            Browse the Robokorda Africa shop to add classroom resources, starter
            kits, and robotics components to your order.
          </p>
          <div className="mt-8">
            <Link href="/shop" className="btn-primary">
              Return to shop
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="section-shell section-space">
      <div className="grid gap-10 xl:grid-cols-[1.7fr_0.85fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
              Cart
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-brand-ink">
              Review your selected items.
            </h1>
          </div>
          {items.map((item) => (
            <Card key={item.id} className="p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                <PlaceholderMedia
                  mode="product"
                  label={`${item.name} Cart Placeholder`}
                  seed={item.seed}
                  imageUrl={item.imageSrc}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                        {item.category}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-brand-ink">
                        {item.name}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-brand-muted">
                        {item.shortDescription}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-blue-strong"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 border-t border-brand-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <QuantityControl
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.id, value)}
                    />
                    <div className="text-right">
                      <p className="text-sm text-brand-muted">Line total</p>
                      <p className="text-2xl font-semibold text-brand-ink">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
            <Link href="/checkout" className="btn-primary">
              Proceed to Checkout
            </Link>
          </div>
        </div>
        <CartSummary className="xl:sticky xl:top-28" />
      </div>
    </div>
  );
}
