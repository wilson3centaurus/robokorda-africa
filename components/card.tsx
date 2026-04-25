import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "white" | "blue" | "soft" | "dark" | "neon";
};

export function Card({ children, className, variant = "default" }: CardProps) {
  const variantClass =
    variant === "blue"
      ? "border border-[rgba(90,87,200,0.30)] bg-[linear-gradient(145deg,var(--surface-2),var(--surface-3))] text-[var(--text-primary)]"
      : variant === "neon"
        ? "border border-[rgba(0,229,160,0.35)] bg-[linear-gradient(145deg,var(--surface-2),var(--surface-3))] text-[var(--text-primary)]"
        : variant === "soft"
          ? "border border-[var(--surface-border-subtle)] bg-[var(--surface-3)]/70 text-[var(--text-primary)]"
          : variant === "white"
            ? "border border-[var(--surface-border)] bg-[var(--surface-3)]/90 text-[var(--text-primary)]"
            : variant === "dark"
              ? "border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] text-[var(--text-primary)]"
              : "border border-[var(--surface-border)] bg-[var(--surface-2)]/80 text-[var(--text-primary)]";

  return (
    <div
      className={cn(
        "surface-shadow hover-lift rounded-2xl p-5 sm:p-7",
        variantClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
