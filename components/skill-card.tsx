import type { SkillTheme } from "@/data/site";
import { Card } from "@/components/card";

export function SkillCard({ skill }: { skill: SkillTheme }) {
  const Icon = skill.icon;

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col gap-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cloud text-brand-blue">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-xl font-semibold text-brand-ink">{skill.title}</h3>
          <p className="mt-3 text-sm leading-7 text-brand-muted">
            {skill.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
