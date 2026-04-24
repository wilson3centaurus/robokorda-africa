import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "", className)}>
      <div className={cn("flex items-center gap-2 mb-3", align === "center" ? "justify-center" : "")}>
        <div className="h-px w-6 bg-gradient-to-r from-transparent to-[#0066ff]" />
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#4d7499]">{eyebrow}</p>
        <div className="h-px w-6 bg-gradient-to-l from-transparent to-[#0066ff]" />
      </div>
      <h2 className="mt-2 text-balance text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.6rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[0.95rem] leading-7 text-[#8db5d8] sm:text-base sm:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}
