"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Card } from "@/components/card";
import { useCart } from "@/providers/cart-provider";
import { cn, formatCurrency } from "@/lib/utils";

type CartSummaryProps = {
  className?: string;
  compact?: boolean;
};

export function CartSummary({ className, compact = false }: CartSummaryProps) {
  const { itemCount, subtotal } = useCart();
  const delivery = itemCount > 0 ? 25 : 0;
  const total = subtotal + delivery;

  return (
    <Card className={cn("space-y-6", className)}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Cart Summary
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-brand-ink">
          {itemCount} item{itemCount === 1 ? "" : "s"} selected
        </h3>
      </div>
      <div className="space-y-4 text-sm text-brand-muted">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-brand-ink">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Estimated delivery</span>
          <span className="font-semibold text-brand-ink">
            {formatCurrency(delivery)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-brand-line pt-4 text-base">
          <span className="font-semibold text-brand-ink">Estimated total</span>
          <span className="font-semibold text-brand-ink">{formatCurrency(total)}</span>
        </div>
      </div>
      <div className="rounded-[24px] border border-brand-line bg-brand-soft p-5 text-sm leading-7 text-brand-muted">
        Robokorda Africa supports school, parent, and partner orders. Delivery is
        estimated here and can be refined later for bulk or pickup requests.
      </div>
      {!compact ? (
        <div className="space-y-3">
          <Link href="/checkout" className="btn-primary w-full">
            Proceed to checkout
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/shop" className="btn-secondary w-full">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Continue shopping
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
