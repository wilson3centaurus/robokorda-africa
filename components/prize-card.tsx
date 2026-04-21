import type { PrizeTier } from "@/lib/page-types";
import { Card } from "@/components/card";

export function PrizeCard({ prize }: { prize: PrizeTier }) {
  const Icon = prize.icon;

  return (
    <Card className="h-full" variant="blue">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
        {prize.title}
      </p>
      <h3 className="mt-3 flex items-center gap-3 text-4xl font-semibold">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-blue-strong">
          1
        </span>
        {prize.amount}
      </h3>
      <p className="mt-4 text-sm leading-7 text-white/82">{prize.summary}</p>
      <ol className="mt-6 space-y-3 text-sm text-white/86">
        {prize.benefits.map((benefit, index) => (
          <li key={benefit} className="flex items-center gap-3">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-blue-strong">
              {index + 2}
            </span>
            {benefit}
          </li>
        ))}
      </ol>
    </Card>
  );
}
