import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  href?: string;
  className?: string;
  light?: boolean;
  prominent?: boolean;
};

export function Logo({
  compact = false,
  href = "/",
  className,
  light = false,
  prominent = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full transition-colors",
        prominent ? "gap-4" : "gap-3",
        light ? "hover:text-white" : "hover:text-brand-blue-deep",
        className,
      )}
      aria-label="Robokorda Africa home"
    >
      <span
        className={cn(
          "relative overflow-hidden bg-white shadow-[0_16px_30px_rgba(15,97,196,0.22)] ring-1 ring-white/12",
          prominent
            ? "h-16 w-16 rounded-[1.55rem]"
            : "h-12 w-12 rounded-[1.15rem]",
        )}
      >
        <Image
          src="/brand/logo.png"
          alt=""
          fill
          priority={prominent}
          sizes={prominent ? "64px" : "48px"}
          className="scale-[1.08] object-cover object-top"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-semibold uppercase tracking-[0.18em]",
            prominent ? "text-[1.05rem]" : "text-sm",
            light ? "text-white" : "text-brand-blue",
          )}
        >
          Robokorda
        </span>
        {!compact ? (
          <span
            className={cn(
              "mt-1 font-medium",
              prominent ? "text-[1.35rem]" : "text-sm",
              light ? "text-white/76" : "text-brand-ink",
            )}
          >
            Africa
          </span>
        ) : null}
      </span>
    </Link>
  );
}
