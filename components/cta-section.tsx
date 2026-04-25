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
    <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-8 shadow-[0_0_60px_var(--electric-glow)] sm:p-10">
      {/* Glow blobs */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--electric-subtle)] blur-3xl" />
      <div className="absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-[var(--neon-subtle)] blur-3xl" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--neon)]">
            Next Step
          </p>
          <h2 className="mt-4 text-balance text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="btn-primary"
          >
            {primary.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(0,229,160,0.35)] px-6 py-3 text-sm font-semibold text-[var(--neon)] transition hover:border-[rgba(0,229,160,0.65)] hover:bg-[var(--neon-subtle)]"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
