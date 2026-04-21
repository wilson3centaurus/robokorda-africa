import { Check } from "lucide-react";
import type { PricingPackage } from "@/lib/page-types";
import { Card } from "@/components/card";
import { formatCurrency } from "@/lib/utils";

export function PriceCatalogue({ packages }: { packages: PricingPackage[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {packages.map((item) => (
        <Card
          key={item.title}
          className="h-full"
          variant={item.highlight ? "blue" : "white"}
        >
          <p
            className={
              item.highlight
                ? "text-sm font-semibold uppercase tracking-[0.24em] text-white/72"
                : "text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue"
            }
          >
            {item.title}
          </p>
          <h3 className="mt-4 text-4xl font-semibold">
            {formatCurrency(item.price)}
          </h3>
          <p
            className={
              item.highlight
                ? "mt-4 text-sm leading-7 text-white/84"
                : "mt-4 text-sm leading-7 text-brand-muted"
            }
          >
            {item.description}
          </p>
          <ul className="mt-6 space-y-3">
            {item.features.map((feature) => (
              <li
                key={feature}
                className={
                  item.highlight
                    ? "flex items-center gap-3 text-sm text-white/86"
                    : "flex items-center gap-3 text-sm text-brand-muted"
                }
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={item.highlight ? "btn-secondary mt-8 w-full" : "btn-primary mt-8 w-full"}
          >
            Order Now
          </button>
        </Card>
      ))}
    </div>
  );
}
