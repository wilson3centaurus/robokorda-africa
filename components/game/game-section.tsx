"use client";

import dynamic from "next/dynamic";
import { Cpu, Gamepad2 } from "lucide-react";

const RobotMazeGame = dynamic(
  () => import("@/components/game/robot-maze-game").then((m) => m.RobotMazeGame),
  { ssr: false, loading: () => (
    <div className="flex h-40 items-center justify-center gap-3 text-[var(--text-secondary)]">
      <Cpu className="h-5 w-5 animate-pulse" />
      <span className="text-sm">Loading game…</span>
    </div>
  ) },
);

export function GameSection() {
  return (
    <section className="section-space circuit-bg">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Gamepad2 className="h-5 w-5 text-[#00e5a0]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Interactive Demo
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              Program the Robot
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              Navigate through the circuit maze — a taste of the problem-solving skills our learners develop every day.
            </p>
          </div>

          {/* Game */}
          <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4 sm:p-6 shadow-[0_0_60px_var(--electric-glow)]">
            <RobotMazeGame />
          </div>

          <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
            Inspired by the real robotics challenges we teach at Robokorda Africa
          </p>
        </div>
      </div>
    </section>
  );
}
