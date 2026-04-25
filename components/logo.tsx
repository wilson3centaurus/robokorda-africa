import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  href?: string;
  className?: string;
  /** Force white text — use on transparent/dark hero backgrounds */
  light?: boolean;
  prominent?: boolean;
  /** Override the logo image URL (falls back to /brand/logo.png) */
  src?: string;
};

export function Logo({
  compact = false,
  href = "/",
  className,
  light = false,
  prominent = false,
  src = "/brand/logo.png",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex select-none items-center rounded-full transition-colors",
        prominent ? "gap-4" : "gap-3",
        light ? "hover:text-white/90" : "hover:text-[var(--electric)]",
        className,
      )}
      aria-label="Robokorda Africa home"
    >
      <span
        className={cn(
          "relative overflow-hidden bg-white shadow-[0_8px_24px_rgba(52,47,197,0.22)] ring-1 ring-white/10",
          prominent
            ? "h-16 w-16 rounded-[1.55rem]"
            : "h-12 w-12 rounded-[1.15rem]",
        )}
      >
        <Image
          src={src}
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
            light ? "text-white" : "text-[var(--text-primary)]",
          )}
        >
          Robokorda
        </span>
        {!compact ? (
          <span
            className={cn(
              "mt-1 font-medium",
              prominent ? "text-[1.35rem]" : "text-sm",
              light ? "text-white/76" : "text-[var(--text-secondary)]",
            )}
          >
            Africa
          </span>
        ) : null}
      </span>
    </Link>
  );
}
