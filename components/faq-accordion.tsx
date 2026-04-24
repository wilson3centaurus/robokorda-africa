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
                ? "border-[rgba(0,102,255,0.35)] bg-[rgba(4,13,30,0.95)]"
                : "border-[rgba(0,102,255,0.12)] bg-[rgba(7,20,40,0.6)]",
            )}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(open ? -1 : index)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
              aria-expanded={open}
            >
              <span className={cn("text-sm font-semibold sm:text-base transition-colors", open ? "text-white" : "text-[#8db5d8]")}>
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 flex-none transition-all duration-200",
                  open ? "rotate-180 text-[#0066ff]" : "text-[#2a4d80]",
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
                <p className="px-6 pb-5 text-sm leading-7 text-[#4d7499]">
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
