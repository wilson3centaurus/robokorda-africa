import type { PartnerCategory } from "@/data/site";
import { PlaceholderMedia } from "@/components/placeholder-media";

export function PartnerCard({ partner }: { partner: PartnerCategory }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5 transition-colors hover:border-[var(--electric-bright)] hover:shadow-[0_0_24px_var(--electric-glow)]">
      <PlaceholderMedia
        mode="partner"
        label={`${partner.title} Placeholder`}
        seed={partner.seed}
        imageUrl={partner.imageSrc}
      />
      <h3 className="mt-5 text-lg font-bold text-[var(--text-primary)]">{partner.title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{partner.description}</p>
    </div>
  );
}
