import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "white" | "blue" | "soft";
};

export function Card({
  children,
  className,
  variant = "white",
}: CardProps) {
  const variantClassName =
    variant === "blue"
      ? "border border-white/12 bg-[linear-gradient(145deg,#0b2340,#0d63c9)] text-white"
      : variant === "soft"
        ? "border border-brand-line/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(233,241,251,0.92))] text-brand-ink"
        : "border border-brand-line/80 bg-white/95 text-brand-ink";

  return (
    <div
      className={cn(
        "surface-shadow hover-lift rounded-[30px] p-6 sm:p-8",
        variantClassName,
        className,
      )}
    >
      {children}
    </div>
  );
}
