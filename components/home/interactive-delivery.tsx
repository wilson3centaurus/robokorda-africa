"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DeliveryOption } from "@/data/site";
import { BlueCard } from "@/components/cards/blue-card";
import { PlaceholderImage } from "@/components/placeholder-image";

export function InteractiveDelivery({
  options,
}: {
  options: DeliveryOption[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOption = options[activeIndex];
  const Icon = activeOption.icon;

  return (
    <div className="-mt-48 grid gap-6 lg:-mt-56 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="space-y-4">
        {options.map((option, index) => {
          const OptionIcon = option.icon;
          const active = index === activeIndex;

          return (
            <button
              key={option.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={
                active
                  ? "surface-shadow w-full rounded-[28px] border border-brand-blue bg-white p-5 text-left"
                  : "w-full rounded-[28px] border border-brand-line bg-white p-5 text-left transition hover:border-brand-blue"
              }
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cloud text-brand-blue">
                  <OptionIcon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-brand-ink">
                    {option.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-brand-muted">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <BlueCard className="mesh-panel relative overflow-hidden">
        <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeOption.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="space-y-5">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">
                  Active delivery model
                </p>
                <h3 className="mt-3 text-3xl font-semibold">{activeOption.title}</h3>
              </div>
              <p className="text-sm leading-8 text-white/82">
                {activeOption.description}
              </p>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-sm leading-8 text-white/82">
                {activeOption.detail}
              </div>
            </div>
            <PlaceholderImage
              src={activeOption.imageSrc}
              label={activeOption.title}
              title="Robokorda delivery format"
              className="aspect-[4/3] w-full border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]"
            />
          </motion.div>
        </AnimatePresence>
      </BlueCard>
    </div>
  );
}
