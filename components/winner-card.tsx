import type { WinnerStory } from "@/lib/page-types";
import { Card } from "@/components/card";
import { PlaceholderMedia } from "@/components/placeholder-media";

export function WinnerCard({ winner }: { winner: WinnerStory }) {
  return (
    <Card className="h-full">
      <PlaceholderMedia
        mode="card"
        label="Winner Team Image"
        seed={winner.seed}
        imageUrl={winner.imageSrc ?? `https://picsum.photos/seed/${winner.seed}/900/720`}
        clean={Boolean(winner.imageSrc)}
      />
      <div className="mt-5">
        {winner.awardLabel ? (
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue-strong">
            {winner.awardLabel}
          </p>
        ) : null}
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">
          {winner.country}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-brand-ink">
          {winner.teamName}
        </h3>
        <p className="mt-2 text-sm font-medium text-brand-muted">{winner.category}</p>
        <p className="mt-4 text-sm leading-7 text-brand-muted">{winner.summary}</p>
      </div>
    </Card>
  );
}
