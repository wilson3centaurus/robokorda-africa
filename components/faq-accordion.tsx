"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/data/site";
import { Card } from "@/components/card";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = activeIndex === index;

        return (
          <Card key={item.question} className="overflow-hidden p-0">
            <button
              type="button"
              onClick={() => setActiveIndex(open ? -1 : index)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7"
              aria-expanded={open}
            >
              <span className="text-base font-semibold text-brand-ink sm:text-lg">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 flex-none text-brand-blue transition-transform",
                  open ? "rotate-180" : "",
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
                <p className="px-6 pb-6 text-sm leading-7 text-brand-muted sm:px-7">
                  {item.answer}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
