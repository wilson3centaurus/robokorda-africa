import type { PartnerCategory } from "@/data/site";
import { Card } from "@/components/card";
import { PlaceholderMedia } from "@/components/placeholder-media";

export function PartnerCard({ partner }: { partner: PartnerCategory }) {
  return (
    <Card className="h-full">
      <PlaceholderMedia
        mode="partner"
        label={`${partner.title} Placeholder`}
        seed={partner.seed}
        imageUrl={partner.imageSrc}
      />
      <h3 className="mt-5 text-xl font-semibold text-brand-ink">{partner.title}</h3>
      <p className="mt-3 text-sm leading-7 text-brand-muted">{partner.description}</p>
    </Card>
  );
}

