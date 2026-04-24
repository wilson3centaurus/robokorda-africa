import { MapPin, Phone } from "lucide-react";
import type { ContactLocation } from "@/data/site";

export function ContactCard({ location }: { location: ContactLocation }) {
  const Icon = location.icon;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(7,20,40,0.8)] p-5">
      {/* Icon header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(0,102,255,0.3)] bg-[rgba(0,102,255,0.1)]">
          <Icon className="h-5 w-5 text-[#7eb8ff]" aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold text-white">{location.title}</h3>
      </div>

      {/* Address */}
      <div className="space-y-2 text-sm text-[#4d7499]">
        {location.addressLines.map((line) => (
          <div key={line} className="flex items-start gap-2">
            {line.startsWith("Phone:") ? (
              <>
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a4d80]" />
                <a
                  href={`tel:${line.replace("Phone: ", "")}`}
                  className="hover:text-[#7eb8ff] transition leading-5"
                >
                  {line.replace("Phone: ", "")}
                </a>
              </>
            ) : (
              <>
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2a4d80]" />
                <span className="leading-5">{line}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {location.detail && (
        <p className="mt-4 text-xs leading-6 text-[#2a4d80]">{location.detail}</p>
      )}
    </div>
  );
}
