import Image from "next/image";
import type { CountryEntry } from "@/lib/page-types";

export function CountryCard({ country }: { country: CountryEntry }) {
  return (
    <article className="h-full text-center">
      <Image
        src={`https://flagcdn.com/w320/${country.code}.png`}
        alt={`${country.name} flag`}
        width={320}
        height={240}
        className="mx-auto h-auto w-full max-w-[320px] rounded-sm sm:rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        unoptimized
      />
      <p className="mt-2 sm:mt-3 text-[10px] leading-tight sm:text-sm font-semibold text-[var(--text-primary)]">
        {country.name}
      </p>
    </article>
  );
}
