import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "",
        className,
      )}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl lg:text-[2.9rem]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-brand-muted sm:text-lg">
        {description}
      </p>
    </div>
  );
}
