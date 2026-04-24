import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CTASectionProps = {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

export function CTASection({ title, description, primary, secondary }: CTASectionProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,102,255,0.25)] bg-gradient-to-br from-[#040d1e] to-[#071428] p-8 shadow-[0_0_60px_rgba(0,102,255,0.08)] sm:p-10">
      {/* Glow blobs */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[rgba(0,102,255,0.12)] blur-3xl" />
      <div className="absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-[rgba(0,229,160,0.06)] blur-3xl" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#00e5a0]">
            Next Step
          </p>
          <h2 className="mt-4 text-balance text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8db5d8]">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc] hover:shadow-[0_0_32px_rgba(0,102,255,0.55)]"
          >
            {primary.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(0,229,160,0.3)] px-6 py-3 text-sm font-semibold text-[#00e5a0] transition hover:border-[rgba(0,229,160,0.6)] hover:bg-[rgba(0,229,160,0.06)]"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
