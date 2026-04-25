import { MapPin, Phone } from "lucide-react";
import type { ContactLocation } from "@/data/site";

export function ContactCard({ location }: { location: ContactLocation }) {
  const Icon = location.icon;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5 transition-colors hover:border-[var(--electric-bright)]">
      {/* Icon header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(52,47,197,0.35)] bg-[rgba(52,47,197,0.12)]">
          <Icon className="h-5 w-5 text-[var(--electric-bright)]" aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold text-[var(--text-primary)]">{location.title}</h3>
      </div>

      {/* Address */}
      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
        {location.addressLines.map((line) => (
          <div key={line} className="flex items-start gap-2">
            {line.startsWith("Phone:") ? (
              <>
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                <a
                  href={`tel:${line.replace("Phone: ", "")}`}
                  className="hover:text-[var(--text-primary)] transition leading-5"
                >
                  {line.replace("Phone: ", "")}
                </a>
              </>
            ) : (
              <>
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                <span className="leading-5">{line}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {location.detail && (
        <p className="mt-4 text-xs leading-6 text-[var(--text-muted)]">{location.detail}</p>
      )}
    </div>
  );
}
