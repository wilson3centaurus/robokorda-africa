"use client";

import dynamic from "next/dynamic";
import { Cpu, Gamepad2 } from "lucide-react";
import { Reveal } from "@/components/reveal";

const RoboDevilGame = dynamic(
  () => import("@/components/game/robo-devil/game").then((m) => m.RoboDevilGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[4/3] items-center justify-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-[#06070f] text-[var(--text-secondary)] sm:aspect-[16/9]">
        <Cpu className="h-5 w-5 animate-pulse text-[var(--electric-bright)]" />
        <span className="text-sm">Booting the factory…</span>
      </div>
    ),
  },
);

export function GameSection() {
  return (
    <section id="arcade" className="section-anchor section-space circuit-bg">
      <div className="section-shell">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-8 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Gamepad2 className="h-5 w-5 text-[#00e5a0]" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                  Robokorda Arcade
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                Robo Devil
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                A 3D trap factory that cheats. Every level hides something that
                only reveals itself after it has killed you — which, as any of
                our competition teams will tell you, is exactly how real
                engineering goes.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-3 shadow-[0_0_60px_var(--electric-glow)] sm:p-5">
              <RoboDevilGame />
            </div>
          </Reveal>

          <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
            Built with three.js — the same problem-solving loop we teach: try,
            fail, learn the pattern, beat it.
          </p>
        </div>
      </div>
    </section>
  );
}
