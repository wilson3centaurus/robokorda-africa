import type { SkillTheme } from "@/data/site";

export function SkillCard({ skill }: { skill: SkillTheme }) {
  const Icon = skill.icon;

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5 sm:p-6 transition-colors hover:border-[var(--electric-bright)] hover:shadow-[0_0_24px_var(--electric-glow)]">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.10)]">
          <Icon className="h-6 w-6 text-[var(--neon)]" aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold leading-tight text-[var(--text-primary)]">{skill.title}</h3>
      </div>
      <p className="text-sm leading-6 text-[var(--text-secondary)]">
        {skill.description}
      </p>
    </div>
  );
}
