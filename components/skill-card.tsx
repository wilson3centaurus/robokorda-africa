import type { SkillTheme } from "@/data/site";

export function SkillCard({ skill }: { skill: SkillTheme }) {
  const Icon = skill.icon;

  return (
    <div className="flex h-full flex-col gap-5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6 transition-colors hover:border-[var(--electric-bright)] hover:shadow-[0_0_24px_var(--electric-glow)]">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.10)]">
        <Icon className="h-7 w-7 text-[var(--neon)]" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{skill.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {skill.description}
        </p>
      </div>
    </div>
  );
}
