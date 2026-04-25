import type { WinnerStory } from "@/lib/page-types";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { Trophy } from "lucide-react";

export function WinnerCard({ winner }: { winner: WinnerStory }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)]">
      <PlaceholderMedia
        mode="card"
        label="Winner Team Image"
        seed={winner.seed}
        imageUrl={winner.imageSrc ?? `https://picsum.photos/seed/${winner.seed}/900/720`}
        clean={Boolean(winner.imageSrc)}
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        {winner.awardLabel && (
          <div className="flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-[#fcd34d]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fcd34d]">
              {winner.awardLabel}
            </p>
          </div>
        )}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric)]">{
winner.country}</p>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">{winner.teamName}</h3>
        <p className="text-xs font-medium text-[var(--text-secondary)]">{winner.category}</p>
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{winner.summary}</p>
      </div>
    </div>
  );
}
