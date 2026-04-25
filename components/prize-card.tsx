import Image from "next/image";
import type { PrizeTier } from "@/lib/page-types";
import { CheckCircle2 } from "lucide-react";

export function PrizeCard({ prize, rank = 1 }: { prize: PrizeTier; rank?: number }) {
  const Icon = prize.icon;
  const rankColors = [
    "text-[#fcd34d] border-[rgba(252,211,77,0.3)] bg-[rgba(252,211,77,0.08)]",  // gold
    "text-[#94a3b8] border-[rgba(148,163,184,0.3)] bg-[rgba(148,163,184,0.08)]", // silver
    "text-[#fb923c] border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.08)]",   // bronze
  ];
  const rankColor = rankColors[(rank - 1) % rankColors.length];
  const rankLabels = ["🥇 Gold", "🥈 Silver", "🥉 Bronze"];
  const rankLabel = rankLabels[(rank - 1) % rankLabels.length];

  return (
    <div className={`flex h-full flex-col rounded-2xl border overflow-hidden ${rankColor}`}>
      {/* Place image */}
      {prize.imageSrc && (
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={prize.imageSrc}
            alt={prize.title}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-bold text-white">
            <Icon className="h-4 w-4" aria-hidden="true" />
            {rankLabel}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mt-4 flex items-center gap-3">
          {!prize.imageSrc && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.06)]">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-current opacity-70">
            {prize.title}
          </p>
        </div>
        <h3 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
          {prize.amount}
        </h3>
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{prize.summary}</p>

        {/* ALL participants note */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.05)] px-3 py-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00e5a0]" />
          <p className="text-[11px] leading-5 text-[#00e5a0]">All participants receive a participation certificate</p>
        </div>

        <ol className="mt-4 space-y-2.5 text-sm text-[var(--text-secondary)]">
          {prize.benefits.map((benefit, index) => (
            <li key={benefit} className="flex items-center gap-3">
              <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] text-[10px] font-bold text-[var(--text-primary)]">
                {index + 1}
              </span>
              {benefit}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
