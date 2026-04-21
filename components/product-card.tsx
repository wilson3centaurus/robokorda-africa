"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/site";
import { motion } from "framer-motion";
import { Card } from "@/components/card";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { useCart } from "@/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeout = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <Card className="flex h-full flex-col gap-6">
      <PlaceholderMedia
        mode="product"
        label={`${product.name} Product Placeholder`}
        seed={product.seed}
        imageUrl={product.imageSrc}
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
            {product.category}
          </p>
          {product.badge ? (
            <span className="rounded-full bg-brand-cloud px-3 py-1 text-xs font-semibold text-brand-blue">
              {product.badge}
            </span>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold text-brand-ink">{product.name}</h3>
        <p className="text-sm leading-7 text-brand-muted">
          {product.shortDescription}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-brand-line bg-brand-soft px-3 py-1 text-xs font-medium text-brand-muted"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${product.id}-star-${index}`}
                  className="h-4 w-4"
                  fill={index < Math.round(product.rating) ? "currentColor" : "none"}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-brand-muted">
                {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-semibold text-brand-ink">
                {formatCurrency(product.price)}
              </span>
              {product.compareAt ? (
                <span className="text-sm text-brand-muted line-through">
                  {formatCurrency(product.compareAt)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          animate={added ? { scale: [1, 1.03, 1] } : undefined}
          onClick={() => {
            addItem(product, 1);
            setAdded(true);
          }}
          className={added ? "btn-secondary w-full" : "btn-primary w-full"}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Added to cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </Card>
  );
}
