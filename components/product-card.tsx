"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/site";
import { motion } from "framer-motion";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { useCart } from "@/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4 transition-colors hover:border-[var(--electric)]">
      <PlaceholderMedia
        mode="product"
        label={`${product.name} Product Placeholder`}
        seed={product.seed}
        imageUrl={product.imageSrc}
      />
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--electric)]">
            {product.category}
          </p>
          {product.badge && (
            <span className="rounded-full border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)] px-2.5 py-0.5 text-[9px] font-bold text-[#00e5a0]">
              {product.badge}
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight"> {product.name}</h3>
        <p className="text-[13px] leading-snug text-[var(--text-secondary)]">{product.shortDescription}</p>
        <div className="flex flex-wrap gap-1.5">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-[var(--surface-border-subtle)] bg-[var(--electric-subtle)] px-2 py-[3px] text-[9px] font-medium text-[var(--electric-bright)]"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${product.id}-star-${index}`}
                  className="h-3 w-3"
                  fill={index < Math.round(product.rating) ? "currentColor" : "none"}
                />
              ))}
              <span className="ml-1.5 text-[11px] text-[var(--text-muted)]">
                {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>
            <div className="mt-2 text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              {formatCurrency(product.price)}
              {product.compareAt && (
                <span className="text-xs text-[var(--text-muted)] line-through font-medium">
                  {formatCurrency(product.compareAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          animate={added ? { scale: [1, 1.03, 1] } : undefined}
          onClick={() => { addItem(product, 1); setAdded(true); }}
          className={
            added
              ? "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(0,229,160,0.4)] bg-[rgba(0,229,160,0.08)] px-4 py-2.5 text-xs font-semibold text-[#00e5a0] transition"
              : "btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition"
          }
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
              Add
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
