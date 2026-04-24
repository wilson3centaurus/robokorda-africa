"use client";

import dynamic from "next/dynamic";
import { Cpu, Gamepad2 } from "lucide-react";

const RobotMazeGame = dynamic(
  () => import("@/components/game/robot-maze-game").then((m) => m.RobotMazeGame),
  { ssr: false, loading: () => (
    <div className="flex h-40 items-center justify-center gap-3 text-[#4d7499]">
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
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#4d7499]">
                Interactive Demo
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Program the Robot
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#8db5d8]">
              Navigate through the circuit maze — a taste of the problem-solving skills our learners develop every day.
            </p>
          </div>

          {/* Game */}
          <div className="rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.8)] p-4 sm:p-6 shadow-[0_0_60px_rgba(0,102,255,0.08)]">
            <RobotMazeGame />
          </div>

          <p className="mt-4 text-center text-xs text-[#2a4d80]">
            Inspired by the real robotics challenges we teach at Robokorda Africa
          </p>
        </div>
      </div>
    </section>
  );
}
