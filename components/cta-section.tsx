import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/card";

type CTASectionProps = {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

export function CTASection({
  title,
  description,
  primary,
  secondary,
}: CTASectionProps) {
  return (
    <Card variant="blue" className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
            Next Step
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/82">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={primary.href} className="btn-secondary">
            {primary.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="btn-ghost">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
