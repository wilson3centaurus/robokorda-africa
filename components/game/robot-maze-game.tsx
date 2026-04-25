"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Trophy, RotateCcw, Cpu, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Maze definitions ─────────────────────────────────────────────────────────

const CELL = 32; // cell size in pixels
const COLS = 15;
const ROWS = 11;

// 0 = path, 1 = wall, 2 = goal
const MAZES = [
  {
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    start: { x: 1, y: 1 },
    name: "Alpha Circuit",
  },
  {
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    start: { x: 1, y: 1 },
    name: "Beta Grid",
  },
];

type Pos = { x: number; y: number };

function drawMaze(ctx: CanvasRenderingContext2D, grid: number[][], robot: Pos, steps: number) {
  const w = COLS * CELL;
  const h = ROWS * CELL;

  // Background
  ctx.fillStyle = "#07061a";
  ctx.fillRect(0, 0, w, h);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = grid[row][col];
      const x = col * CELL;
      const y = row * CELL;

      if (cell === 1) {
        // Wall — dark blue with grid lines
        ctx.fillStyle = "#0d0b24";
        ctx.fillRect(x, y, CELL, CELL);
        ctx.strokeStyle = "rgba(52,47,197,0.25)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);

        // Circuit dots on walls
        if ((col + row) % 4 === 0) {
          ctx.beginPath();
          ctx.arc(x + CELL / 2, y + CELL / 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(52,47,197,0.35)";
          ctx.fill();
        }
      } else if (cell === 2) {
        // Goal
        ctx.fillStyle = "rgba(0,229,160,0.08)";
        ctx.fillRect(x, y, CELL, CELL);

        // Pulsing target
        const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 400);
        const r = CELL * 0.35 * pulse;
        const grd = ctx.createRadialGradient(x + CELL / 2, y + CELL / 2, 0, x + CELL / 2, y + CELL / 2, r);
        grd.addColorStop(0, "rgba(0,229,160,0.9)");
        grd.addColorStop(1, "rgba(0,229,160,0)");
        ctx.beginPath();
        ctx.arc(x + CELL / 2, y + CELL / 2, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Flag icon
        ctx.fillStyle = "#00e5a0";
        ctx.font = `${CELL * 0.55}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🏁", x + CELL / 2, y + CELL / 2);
      } else {
        // Path — very dark
        ctx.fillStyle = "#07061a";
        ctx.fillRect(x, y, CELL, CELL);
      }
    }
  }

  // Robot
  const rx = robot.x * CELL;
  const ry = robot.y * CELL;
  const pad = 4;

  // Body glow
  const grd = ctx.createRadialGradient(rx + CELL / 2, ry + CELL / 2, 0, rx + CELL / 2, ry + CELL / 2, CELL);
  grd.addColorStop(0, "rgba(52,47,197,0.35)");
  grd.addColorStop(1, "rgba(52,47,197,0)");
  ctx.beginPath();
  ctx.arc(rx + CELL / 2, ry + CELL / 2, CELL, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  // Body
  ctx.fillStyle = "#342FC5";
  ctx.beginPath();
  ctx.roundRect(rx + pad, ry + pad, CELL - pad * 2, CELL - pad * 2, 6);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#00e5a0";
  ctx.beginPath();
  ctx.arc(rx + CELL * 0.35, ry + CELL * 0.38, 3, 0, Math.PI * 2);
  ctx.arc(rx + CELL * 0.65, ry + CELL * 0.38, 3, 0, Math.PI * 2);
  ctx.fill();

  // Steps counter on canvas
  ctx.fillStyle = "rgba(0,229,160,0.9)";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`STEPS: ${steps}`, 6, 4);
}

export function RobotMazeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [level, setLevel] = useState(0);
  const [steps, setSteps] = useState(0);
  const [robot, setRobot] = useState<Pos>(MAZES[0].start);
  const [won, setWon] = useState(false);
  const [totalWins, setTotalWins] = useState(0);

  const maze = MAZES[level % MAZES.length];

  const reset = useCallback(() => {
    setRobot(maze.start);
    setSteps(0);
    setWon(false);
  }, [maze.start]);

  useEffect(() => { reset(); }, [level, reset]);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      drawMaze(ctx!, maze.grid, robot, steps);
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [maze, robot, steps]);

  const move = useCallback(
    (dx: number, dy: number) => {
      if (won) return;
      setRobot((prev) => {
        const nx = prev.x + dx;
        const ny = prev.y + dy;
        if (ny < 0 || ny >= ROWS || nx < 0 || nx >= COLS) return prev;
        const cell = maze.grid[ny][nx];
        if (cell === 1) return prev; // wall

        setSteps((s) => s + 1);

        if (cell === 2) {
          setWon(true);
          setTotalWins((w) => w + 1);
        }

        return { x: nx, y: ny };
      });
    },
    [won, maze],
  );

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
        W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0],
      };
      const delta = map[e.key];
      if (delta) {
        e.preventDefault();
        move(delta[0], delta[1]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [move]);

  const nextLevel = () => {
    setLevel((l) => l + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Header */}
      <div className="flex w-full max-w-[480px] items-center justify-between px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Level {(level % MAZES.length) + 1}</p>
          <p className="text-sm font-semibold text-[var(--electric-bright)]">{maze.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.08)] px-3 py-1">
            <Trophy className="h-3.5 w-3.5 text-[#00e5a0]" />
            <span className="text-xs font-bold text-[#00e5a0]">{totalWins}</span>
          </div>
          <button
            onClick={reset}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--electric-bright)] hover:bg-[var(--surface-border)] transition"
            style={{ minHeight: "unset", minWidth: "unset" }}
            aria-label="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--surface-border)] shadow-[0_0_40px_var(--electric-glow)]">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="block"
          style={{ imageRendering: "pixelated", maxWidth: "100%" }}
        />

        {/* Win overlay */}
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(2,8,16,0.88)] backdrop-blur-sm">
            <div className="text-center">
              <p className="text-4xl">🏆</p>
              <h3 className="mt-2 text-xl font-bold text-[var(--text-primary)]">Level Complete!</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Solved in <span className="font-bold text-[#00e5a0]">{steps}</span> steps</p>
              <button
                onClick={nextLevel}
                className="btn-primary mt-4"
              >
                <Cpu className="h-4 w-4" />
                Next Level
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <button onClick={() => move(0, -1)} className="flex h-12 w-full items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--electric-bright)] active:bg-[var(--surface-border)]" style={{ minHeight: "unset" }}>
          <ChevronUp className="h-6 w-6" />
        </button>
        <div />
        <button onClick={() => move(-1, 0)} className="flex h-12 w-full items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--electric-bright)] active:bg-[var(--surface-border)]" style={{ minHeight: "unset" }}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={() => move(0, 1)} className="flex h-12 w-full items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--electric-bright)] active:bg-[var(--surface-border)]" style={{ minHeight: "unset" }}>
          <ChevronDown className="h-6 w-6" />
        </button>
        <button onClick={() => move(1, 0)} className="flex h-12 w-full items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--electric-bright)] active:bg-[var(--surface-border)]" style={{ minHeight: "unset" }}>
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop hint */}
      <p className="hidden text-xs text-[var(--text-secondary)] sm:block">
        Use <kbd className="rounded border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--electric-bright)]">↑ ↓ ← →</kbd> or{" "}
        <kbd className="rounded border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--electric-bright)]">W A S D</kbd> to navigate
      </p>
    </div>
  );
}
