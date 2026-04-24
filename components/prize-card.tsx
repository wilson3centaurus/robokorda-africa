import type { PrizeTier } from "@/lib/page-types";

export function PrizeCard({ prize, rank = 1 }: { prize: PrizeTier; rank?: number }) {
  const Icon = prize.icon;
  const rankColors = [
    "text-[#fcd34d] border-[rgba(252,211,77,0.3)] bg-[rgba(252,211,77,0.08)]",  // gold
    "text-[#94a3b8] border-[rgba(148,163,184,0.3)] bg-[rgba(148,163,184,0.08)]", // silver
    "text-[#fb923c] border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.08)]",   // bronze
  ];
  const rankColor = rankColors[(rank - 1) % rankColors.length];

  return (
    <div className={`flex h-full flex-col rounded-2xl border p-6 ${rankColor}`}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.06)]">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-current opacity-70">
        {prize.title}
      </p>
      <h3 className="mt-3 text-3xl font-bold text-white">
        {prize.amount}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#8db5d8]">{prize.summary}</p>
      <ol className="mt-5 space-y-2.5 text-sm text-[#4d7499]">
        {prize.benefits.map((benefit, index) => (
          <li key={benefit} className="flex items-center gap-3">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] text-[10px] font-bold text-white">
              {index + 1}
            </span>
            {benefit}
          </li>
        ))}
      </ol>
    </div>
  );
}
