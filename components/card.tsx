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
      ? "border border-[rgba(0,102,255,0.3)] bg-[linear-gradient(145deg,#040d1e,#071428)] text-white"
      : variant === "neon"
        ? "border border-[rgba(0,229,160,0.35)] bg-[linear-gradient(145deg,#040d1e,#071428)] text-white"
        : variant === "soft"
          ? "border border-[rgba(38,133,255,0.12)] bg-[rgba(10,28,56,0.7)] text-[#e8f4fd]"
          : variant === "white"
            ? "border border-[rgba(38,133,255,0.15)] bg-[rgba(14,37,72,0.9)] text-[#e8f4fd]"
            : variant === "dark"
              ? "border border-[rgba(38,133,255,0.08)] bg-[#040d1e] text-[#e8f4fd]"
              : "border border-[rgba(38,133,255,0.15)] bg-[rgba(7,20,40,0.8)] text-[#e8f4fd]";

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
