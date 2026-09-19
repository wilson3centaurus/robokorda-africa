import type { SkillTheme } from "@/data/site";

export function SkillCard({ skill }: { skill: SkillTheme }) {
  const Icon = skill.icon;

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5 sm:p-6 transition-colors hover:border-[var(--electric-bright)] hover:shadow-[0_0_24px_var(--electric-glow)]">
      {/* Stacks on phones: in the two-column mobile grid a long word like
          "Communication" cannot fit beside the icon and overflows the card. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.10)] sm:h-12 sm:w-12">
          <Icon className="h-6 w-6 text-[var(--neon)]" aria-hidden="true" />
        </span>
        <h3 className="min-w-0 break-words text-base font-bold leading-tight text-[var(--text-primary)]">{skill.title}</h3>
      </div>
      <p className="text-sm leading-6 text-[var(--text-secondary)]">
        {skill.description}
      </p>
    </div>
  );
}
