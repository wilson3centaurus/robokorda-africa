import type { PartnerCategory } from "@/data/site";
import { PlaceholderMedia } from "@/components/placeholder-media";

export function PartnerCard({ partner }: { partner: PartnerCategory }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[rgba(0,102,255,0.18)] bg-[rgba(7,20,40,0.7)] p-5 transition-colors hover:border-[rgba(0,102,255,0.3)]">
      <PlaceholderMedia
        mode="partner"
        label={`${partner.title} Placeholder`}
        seed={partner.seed}
        imageUrl={partner.imageSrc}
      />
      <h3 className="mt-5 text-lg font-bold text-white">{partner.title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#4d7499]">{partner.description}</p>
    </div>
  );
}
