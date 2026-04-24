import type { SkillTheme } from "@/data/site";

export function SkillCard({ skill }: { skill: SkillTheme }) {
  const Icon = skill.icon;

  return (
    <div className="flex h-full flex-col gap-5 rounded-2xl border border-[rgba(0,102,255,0.18)] bg-[rgba(7,20,40,0.7)] p-6 transition-colors hover:border-[rgba(0,102,255,0.35)]">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)]">
        <Icon className="h-7 w-7 text-[#00e5a0]" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-lg font-bold text-white">{skill.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#4d7499]">
          {skill.description}
        </p>
      </div>
    </div>
  );
}
