"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/data/site";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = activeIndex === index;

        return (
          <div
            key={item.question}
            className={cn(
              "overflow-hidden rounded-xl border transition-colors duration-200",
              open
                ? "border-[var(--electric-bright)] bg-[var(--surface-1)]"
                : "border-[var(--surface-border)] bg-[var(--surface-1)]/70",
            )}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(open ? -1 : index)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
              aria-expanded={open}
            >
              <span className={cn("text-sm font-semibold sm:text-base transition-colors", open ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 flex-none transition-all duration-200",
                  open ? "rotate-180 text-[var(--electric-bright)]" : "text-[var(--text-muted)]",
                )}
                aria-hidden="true"
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-7 text-[var(--text-secondary)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
