"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, ChevronUp, Play, RotateCcw, Skull,
  Trophy, Volume2, VolumeX, X,
} from "lucide-react";
import { useDeviceProfile } from "@/components/three/use-device-profile";
import { createState, step, type GameState, type Input } from "./engine";
import { DEATH_LINES, LEVELS } from "./levels";
import { RoboDevilScene } from "./scene";
import * as sfx from "./sfx";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "robokorda.robodevil.v1";

type Progress = { unlocked: number; deaths: number };

function loadProgress(): Progress {
  if (typeof window === "undefined") return { unlocked: 0, deaths: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlocked: 0, deaths: 0 };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      unlocked: Math.min(Math.max(parsed.unlocked ?? 0, 0), LEVELS.length - 1),
      deaths: Math.max(parsed.deaths ?? 0, 0),
    };
  } catch {
    return { unlocked: 0, deaths: 0 };
  }
}

function saveProgress(progress: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* private mode — progress just won't persist */
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Hud = {
  levelIndex: number;
  deaths: number;
  levelDeaths: number;
  time: number;
  status: GameState["status"];
};

export function RoboDevilGame() {
  const profile = useDeviceProfile();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoboDevilScene | null>(null);
  const stateRef = useRef<GameState>(createState(0));
  const inputRef = useRef<Input>({ left: false, right: false, jump: false });
  const runningRef = useRef(false);
  /** Gates drawing, separately from simulating: an off-screen canvas draws nothing. */
  const visibleRef = useRef(true);
  const INITIAL_HUD: Hud = { levelIndex: 0, deaths: 0, levelDeaths: 0, time: 0, status: "playing" };
  const hudRef = useRef<Hud>(INITIAL_HUD);

  const [started, setStarted] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  // The component is client-only (`ssr: false`), so reading storage in the
  // initialiser is safe and avoids a flash of "level 1 locked".
  const [unlocked, setUnlocked] = useState(() => loadProgress().unlocked);
  const unlockedRef = useRef(unlocked);
  const [muted, setMuted] = useState(false);
  const [hud, setHud] = useState<Hud>(INITIAL_HUD);
  const [taunt, setTaunt] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const canRender3D = profile.tier !== "off";

  // ── Scene + main loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!canRender3D) return;
    const mount = mountRef.current;
    if (!mount) return;

    let scene: RoboDevilScene;
    try {
      scene = new RoboDevilScene(mount, {
        dpr: profile.tier === "high" ? 1.75 : 1.25,
        antialias: profile.tier === "high",
      });
    } catch {
      // Context creation can still fail on a machine that claims support.
      return;
    }

    sceneRef.current = scene;
    scene.loadLevel(stateRef.current.level);
    scene.setViewBias(profile.touch ? 1.05 : 0);
    scene.resize();

    const observer = new ResizeObserver(() => scene.resize());
    observer.observe(mount);

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = (now - last) / 1000;
      last = now;

      const state = stateRef.current;

      if (runningRef.current) {
        const next = step(state, dt, inputRef.current);
        stateRef.current = next;

        for (const event of next.events) {
          if (event === "jump") sfx.play("jump");
          else if (event === "death") {
            sfx.play("death");
            setTaunt(DEATH_LINES[Math.floor(Math.random() * DEATH_LINES.length)]);
          } else if (event === "respawn") {
            scene.resetDynamic();
            setTaunt(null);
          } else if (event === "win") {
            sfx.play("win");
            runningRef.current = false;

            const cleared = next.levelIndex;
            const nextUnlocked = Math.min(
              Math.max(unlockedRef.current, cleared + 1),
              LEVELS.length - 1,
            );
            unlockedRef.current = nextUnlocked;
            setUnlocked(nextUnlocked);
            saveProgress({ unlocked: nextUnlocked, deaths: next.deaths });
            if (cleared >= LEVELS.length - 1) setFinished(true);
          } else if (event !== "respawn") {
            sfx.play("trap");
          }
        }

        // Only push to React when something a human can see has changed.
        const h = hudRef.current;
        if (
          h.deaths !== next.deaths ||
          h.status !== next.status ||
          h.levelDeaths !== next.levelDeaths ||
          Math.floor(h.time) !== Math.floor(next.time)
        ) {
          hudRef.current = {
            levelIndex: next.levelIndex,
            deaths: next.deaths,
            levelDeaths: next.levelDeaths,
            time: next.time,
            status: next.status,
          };
          setHud(hudRef.current);
        }
      }

      // Drawing an off-screen canvas at 60fps is pure battery burn, and this
      // section sits a long way down a long page.
      if (visibleRef.current) {
        scene.render(stateRef.current, now / 1000, Math.min(dt, 0.05));
      }
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, [canRender3D, profile.tier, profile.touch]);

  // ── Load a level ──────────────────────────────────────────────────────────
  const loadLevel = useCallback((index: number, carryDeaths: number) => {
    const next = createState(index, { deaths: carryDeaths, time: 0 });
    stateRef.current = next;
    hudRef.current = {
      levelIndex: index,
      deaths: next.deaths,
      levelDeaths: 0,
      time: 0,
      status: "playing",
    };
    setHud(hudRef.current);
    setTaunt(null);
    sceneRef.current?.loadLevel(next.level);
    sceneRef.current?.resetDynamic();
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!started) return;

    const GAME_KEYS = new Set([
      "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
      "a", "A", "d", "D", "w", "W", " ", "Spacebar",
    ]);

    const setKey = (e: KeyboardEvent, down: boolean) => {
      switch (e.key) {
        case "ArrowLeft": case "a": case "A":
          inputRef.current.left = down; break;
        case "ArrowRight": case "d": case "D":
          inputRef.current.right = down; break;
        case "ArrowUp": case "w": case "W": case " ": case "Spacebar":
          inputRef.current.jump = down; break;
        default:
          return;
      }
      // Only swallow the key once we know it is a game key, so the rest of the
      // page keeps working while the game is on screen.
      e.preventDefault();
    };

    const onDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setStarted(false); return; }
      if (e.key === "r" || e.key === "R") {
        loadLevel(stateRef.current.levelIndex, stateRef.current.deaths);
        return;
      }
      if (GAME_KEYS.has(e.key)) setKey(e, true);
    };
    const onUp = (e: KeyboardEvent) => { if (GAME_KEYS.has(e.key)) setKey(e, false); };
    const onBlur = () => { inputRef.current = { left: false, right: false, jump: false }; };

    window.addEventListener("keydown", onDown, { passive: false });
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
      onBlur();
    };
  }, [started, loadLevel]);

  // ── Pause when hidden or scrolled away ────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let onScreen = true;
    const sync = () => {
      const awake = onScreen && !document.hidden;
      visibleRef.current = awake;
      const shouldRun = started && awake && stateRef.current.status !== "won";
      runningRef.current = shouldRun;
      if (!shouldRun) inputRef.current = { left: false, right: false, jump: false };
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    observer.observe(mount);

    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      runningRef.current = false;
      visibleRef.current = false;
    };
  }, [started, hud.status]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const start = () => {
    sfx.unlockAudio();
    sfx.play("click");
    setStarted(true);
  };

  const goToLevel = (index: number) => {
    sfx.play("click");
    setLevelIndex(index);
    setFinished(false);
    loadLevel(index, stateRef.current.deaths);
    setStarted(true);
  };

  const nextLevel = () => {
    const next = hud.levelIndex + 1;
    if (next >= LEVELS.length) { setFinished(true); return; }
    goToLevel(next);
  };

  const toggleMute = () => {
    const value = !muted;
    setMuted(value);
    sfx.setMuted(value);
    if (!value) sfx.play("click");
  };

  const hold = (button: "left" | "right" | "jump", down: boolean) => {
    inputRef.current[button] = down;
    if (down && button === "jump") sfx.unlockAudio();
  };

  const level = LEVELS[levelIndex] ?? LEVELS[0];

  if (!canRender3D) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-8 text-center">
        <Skull className="h-7 w-7 text-[var(--text-muted)]" aria-hidden="true" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Robo Devil needs WebGL
        </p>
        <p className="max-w-sm text-xs leading-6 text-[var(--text-secondary)]">
          Your browser has 3D graphics turned off or unavailable. Try a different
          browser, or enable hardware acceleration, to play.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Status bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Level {levelIndex + 1} / {LEVELS.length}
          </p>
          <p className="truncate text-sm font-bold text-[var(--electric-bright)]">{level.name}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Stat icon={Skull} value={hud.deaths} label="deaths" tone="danger" />
          <Stat icon={Trophy} value={formatTime(hud.time)} label="time" tone="neon" />
          <IconButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </IconButton>
          <IconButton
            label="Restart level"
            onClick={() => loadLevel(levelIndex, stateRef.current.deaths)}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>

      {/* ── Viewport ── */}
      <div className="relative aspect-[4/3] max-h-[70svh] w-full overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[#06070f] shadow-[0_0_60px_var(--electric-glow)] sm:aspect-[16/9]">
        <div ref={mountRef} className="absolute inset-0" />

        {/* Death taunt */}
        {taunt && started && (
          <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center px-4">
            <p className="rounded-full border border-[rgba(255,59,92,0.4)] bg-[rgba(24,4,12,0.85)] px-4 py-2 text-center text-xs font-semibold text-[#ff8da2] backdrop-blur-sm">
              {taunt}
            </p>
          </div>
        )}

        {/* Touch controls */}
        {started && profile.touch && hud.status === "playing" && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-3 sm:p-4">
            <div className="flex gap-2.5">
              <TouchButton label="Move left" onHold={(d) => hold("left", d)}>
                <ArrowLeft className="h-6 w-6" />
              </TouchButton>
              <TouchButton label="Move right" onHold={(d) => hold("right", d)}>
                <ArrowRight className="h-6 w-6" />
              </TouchButton>
            </div>
            <TouchButton label="Jump" primary onHold={(d) => hold("jump", d)}>
              <ChevronUp className="h-7 w-7" />
            </TouchButton>
          </div>
        )}

        {/* Exit to page */}
        {started && hud.status === "playing" && (
          <button
            type="button"
            onClick={() => setStarted(false)}
            aria-label="Leave the game"
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-sm transition hover:bg-black/75"
            style={{ minHeight: "unset", minWidth: "unset" }}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* ── Overlays ── */}
        {!started && (
          <Overlay>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#00e5a0]">
              Robokorda Arcade
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Robo Devil</h3>
            <p className="mt-2 max-w-xs text-xs leading-6 text-white/65 sm:max-w-sm sm:text-sm">
              Eight levels of a factory that is actively lying to you. The floor
              drops, the spikes are patient, the exit runs. You will die. That is
              the tutorial.
            </p>
            <button type="button" onClick={start} className="btn-primary mt-5">
              <Play className="h-4 w-4 fill-current" />
              {hud.deaths > 0 ? "Keep going" : "Play"}
            </button>
            <p className="mt-4 text-[11px] text-white/45">
              {profile.touch
                ? "On-screen buttons to move and jump"
                : "← → or A D to move · Space to jump · R to restart · Esc to leave"}
            </p>
          </Overlay>
        )}

        {started && hud.status === "won" && !finished && (
          <Overlay>
            <p className="text-3xl">🏁</p>
            <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              {level.name} — cleared
            </h3>
            <p className="mt-2 text-sm text-white/65">
              {formatTime(hud.time)} · {hud.levelDeaths} death{hud.levelDeaths === 1 ? "" : "s"} on this level
            </p>
            <p className="mt-1 max-w-xs text-xs italic text-white/45">{level.taunt}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={nextLevel} className="btn-primary">
                Next level
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goToLevel(levelIndex)}
                className="btn-ghost !border-white/25 !bg-white/10 !text-white"
              >
                Replay
              </button>
            </div>
          </Overlay>
        )}

        {started && finished && (
          <Overlay>
            <p className="text-4xl">🏆</p>
            <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Factory cleared</h3>
            <p className="mt-2 max-w-xs text-sm text-white/70">
              All {LEVELS.length} levels, {hud.deaths} deaths. That is genuinely
              the kind of persistence we look for at a robotics competition.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => goToLevel(0)} className="btn-primary">
                <RotateCcw className="h-4 w-4" />
                Run it again
              </button>
            </div>
          </Overlay>
        )}
      </div>

      {/* ── Level select ── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {LEVELS.map((lv, i) => {
          const locked = i > unlocked;
          const active = i === levelIndex;
          return (
            <button
              key={lv.name}
              type="button"
              disabled={locked}
              onClick={() => goToLevel(i)}
              title={locked ? "Clear the previous level first" : lv.name}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs font-bold transition",
                active
                  ? "border-[var(--electric)] bg-[var(--electric)] text-white"
                  : locked
                    ? "cursor-not-allowed border-[var(--surface-border-subtle)] bg-transparent text-[var(--text-muted)] opacity-45"
                    : "border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--electric-bright)] hover:border-[var(--electric)]",
              )}
              style={{ minHeight: "unset", minWidth: "unset" }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Small pieces ────────────────────────────────────────────────────────────

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[rgba(4,5,15,0.86)] px-5 text-center backdrop-blur-sm">
      {children}
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: React.ElementType<{ className?: string }>;
  value: number | string;
  label: string;
  tone: "danger" | "neon";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        tone === "danger"
          ? "border-[rgba(255,59,92,0.28)] bg-[rgba(255,59,92,0.08)] text-[#ff8da2]"
          : "border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.08)] text-[#00e5a0]",
      )}
      title={label}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="font-mono text-xs font-bold tabular-nums">{value}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--electric-bright)] transition hover:bg-[var(--surface-border)]"
      style={{ minHeight: "unset", minWidth: "unset" }}
    >
      {children}
    </button>
  );
}

/**
 * A hold-to-act button for touch.
 *
 * Uses pointer capture so a thumb that slides off the button still releases it,
 * and `touch-none` so the browser never steals the gesture for scrolling.
 */
function TouchButton({
  label,
  onHold,
  primary,
  children,
}: {
  label: string;
  onHold: (down: boolean) => void;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onHold(true);
      }}
      onPointerUp={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
      onLostPointerCapture={() => onHold(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "flex h-14 w-14 touch-none select-none items-center justify-center rounded-2xl border backdrop-blur-sm transition active:scale-95 sm:h-16 sm:w-16",
        primary
          ? "border-[rgba(0,229,160,0.45)] bg-[rgba(0,229,160,0.16)] text-[#00e5a0] active:bg-[rgba(0,229,160,0.3)]"
          : "border-white/18 bg-black/45 text-white active:bg-black/70",
      )}
    >
      {children}
    </button>
  );
}
