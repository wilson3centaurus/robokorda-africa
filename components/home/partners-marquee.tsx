import type { PartnerCategory } from "@/data/site";
import { PlaceholderImage } from "@/components/placeholder-image";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: PartnerCategory[];
  reverse?: boolean;
}) {
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div className={reverse ? "marquee-track-reverse gap-6" : "marquee-track gap-6"}>
        {repeated.map((partner, index) => (
          <div
            key={`${partner.title}-${index}`}
            className="w-[19rem] min-w-[19rem] rounded-[28px] border border-brand-line bg-white p-5"
          >
            <PlaceholderImage
              src={partner.imageSrc}
              label="Partner Logo"
              title={partner.title}
              className="aspect-[16/10] w-full"
            />
            <h3 className="mt-4 text-lg font-semibold text-brand-ink">
              {partner.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-brand-muted">
              {partner.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnersMarquee({
  partners,
}: {
  partners: PartnerCategory[];
}) {
  return (
    <div className="space-y-6">
      <MarqueeRow items={partners} />
      <MarqueeRow items={partners.slice().reverse()} reverse />
    </div>
  );
}
