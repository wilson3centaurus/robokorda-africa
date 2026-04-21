import type { ContactLocation } from "@/data/site";
import { Card } from "@/components/card";
import { PlaceholderMedia } from "@/components/placeholder-media";

export function ContactCard({ location }: { location: ContactLocation }) {
  const Icon = location.icon;

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col gap-5">
        <PlaceholderMedia
          mode="partner"
          label={`${location.title} Office Placeholder`}
          seed={location.title.toLowerCase().replace(/\s+/g, "-")}
          aspectRatio="16 / 9"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/22 bg-white/12">
            <Icon className="h-8 w-8" aria-hidden="true" />
          </span>
        </PlaceholderMedia>
        <div>
          <h3 className="text-xl font-semibold text-brand-ink">{location.title}</h3>
          <div className="mt-4 space-y-1 text-sm leading-7 text-brand-muted">
            {location.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-brand-muted">
            {location.detail}
          </p>
        </div>
      </div>
    </Card>
  );
}
