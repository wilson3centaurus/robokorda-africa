/**
 * Robo Devil — game simulation.
 *
 * Deliberately free of React and three.js: the renderer reads this state and
 * draws it, and nothing here knows a canvas exists. That keeps the physics
 * deterministic (fixed timestep, driven by `step`) and testable on its own.
 */

import { LEVELS, TILE_COLS, TILE_ROWS, type Cell, type LevelDef, type Rect, type TrapDef } from "./levels";

// ─── Tuning ──────────────────────────────────────────────────────────────────
// Derived from these: jump apex ≈ 2.5 tiles, full-speed jump ≈ 5.6 tiles across.
// Level design leans on both numbers, so changing them means re-checking gaps.
const GRAVITY = 46;
const MOVE_SPEED = 8.6;
const GROUND_ACCEL = 78;
const AIR_ACCEL = 42;
const GROUND_FRICTION = 62;
const JUMP_VELOCITY = 15.2;
const JUMP_CUT = 0.42;          // velocity kept when the jump key is released early
const MAX_FALL = 26;
const COYOTE_TIME = 0.1;        // grace period to still jump after walking off a ledge
const JUMP_BUFFER = 0.12;       // grace period for pressing jump just before landing

export const PLAYER_W = 0.62;
export const PLAYER_H = 0.86;

const RESPAWN_DELAY = 0.62;
const CRUSH_TIME = 0.22;        // how long a crusher takes to slam
const CRUSH_HOLD = 0.9;
const CRUSH_RETRACT = 0.8;
const SPIKE_RISE = 0.16;
const WALL_RISE = 0.3;
const DART_SPEED = 12;
const SLIDE_SPEED = 7;

export type Input = { left: boolean; right: boolean; jump: boolean };

export type TrapState = {
  def: TrapDef;
  armed: boolean;
  /** Seconds since arming. */
  t: number;
  /** Seconds since the trap actually fired (t - delay), clamped at 0. */
  p: number;
  fired: boolean;
  /** 0..1 animation progress, meaning depends on the kind. */
  amount: number;
  on: boolean;
};

export type Dart = { x: number; y: number; dir: number; alive: boolean };

export type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  facing: number;
  coyote: number;
  buffer: number;
  wasJump: boolean;
};

export type Status = "playing" | "dead" | "won";

export type GameState = {
  levelIndex: number;
  level: LevelDef;
  removed: Set<string>;
  added: Set<string>;
  traps: TrapState[];
  darts: Dart[];
  player: Player;
  spawn: Cell;
  exit: { x: number; y: number; tx: number; ty: number };
  status: Status;
  deathTimer: number;
  deaths: number;
  levelDeaths: number;
  time: number;
  shake: number;
  flash: number;
  /** Bumped whenever a trap fires, so the renderer can react without polling. */
  events: string[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const key = (x: number, y: number) => `${x},${y}`;

function overlaps(ax: number, ay: number, aw: number, ah: number, b: Rect | number[]): boolean {
  return ax < b[0] + b[2] && ax + aw > b[0] && ay < b[1] + b[3] && ay + ah > b[1];
}

export function playerRect(p: Player): Rect {
  return [p.x, p.y, PLAYER_W, PLAYER_H];
}

export function isSolid(state: GameState, tx: number, ty: number): boolean {
  if (tx < 0 || tx >= TILE_COLS) return true;   // side walls
  if (ty < 0) return true;                       // ceiling
  if (ty >= TILE_ROWS) return false;             // the void — fall through and die
  const k = key(tx, ty);
  if (state.added.has(k)) return true;
  if (state.removed.has(k)) return false;
  return state.level.grid[ty][tx] === "#";
}

function findChar(grid: string[], ch: string): Cell {
  for (let y = 0; y < grid.length; y++) {
    const x = grid[y].indexOf(ch);
    if (x >= 0) return [x, y];
  }
  return [1, 1];
}

// ─── Construction ────────────────────────────────────────────────────────────

export function createState(levelIndex: number, carry?: { deaths: number; time: number }): GameState {
  const level = LEVELS[levelIndex % LEVELS.length];
  const spawn = findChar(level.grid, "S");
  const exitCell = findChar(level.grid, "E");

  return {
    levelIndex,
    level,
    removed: new Set(),
    added: new Set(),
    traps: level.traps.map((def) => ({
      def,
      armed: false,
      t: 0,
      p: 0,
      fired: false,
      amount: 0,
      on: false,
    })),
    darts: [],
    player: {
      x: spawn[0] + (1 - PLAYER_W) / 2,
      y: spawn[1] + (1 - PLAYER_H),
      vx: 0,
      vy: 0,
      onGround: false,
      facing: 1,
      coyote: 0,
      buffer: 0,
      wasJump: false,
    },
    spawn,
    exit: { x: exitCell[0], y: exitCell[1], tx: exitCell[0], ty: exitCell[1] },
    status: "playing",
    deathTimer: 0,
    deaths: carry?.deaths ?? 0,
    levelDeaths: 0,
    time: carry?.time ?? 0,
    shake: 0,
    flash: 0,
    events: [],
  };
}

/** Restart the current level, keeping the run totals. */
export function respawn(state: GameState): GameState {
  const next = createState(state.levelIndex, { deaths: state.deaths, time: state.time });
  next.levelDeaths = state.levelDeaths;
  return next;
}

// ─── Hazards ─────────────────────────────────────────────────────────────────

function staticSpikeRects(state: GameState): Rect[] {
  const rects: Rect[] = [];
  const grid = state.level.grid;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") rects.push([x + 0.16, y + 0.4, 0.68, 0.6]);
    }
  }
  return rects;
}

function trapHazards(state: GameState): Rect[] {
  const rects: Rect[] = [];

  for (const ts of state.traps) {
    const { def } = ts;
    if (!ts.fired && def.kind !== "laser") continue;

    switch (def.kind) {
      case "spikeUp":
        if (ts.amount > 0.34) {
          for (const [cx, cy] of def.cells) {
            rects.push([cx + 0.14, cy + 1 - ts.amount, 0.72, ts.amount]);
          }
        }
        break;

      case "spikeDown":
        for (const [cx, cy] of def.cells) {
          rects.push([cx + 0.14, cy + ts.amount * (def.drop ?? 8), 0.72, 1.3]);
        }
        break;

      case "crusher":
        for (const [cx, cy] of def.cells) {
          rects.push([cx + 0.04, cy + ts.amount * (def.drop ?? 6), 0.92, 1]);
        }
        break;

      case "laser":
        if (ts.on) {
          for (const [cx, cy] of def.cells) rects.push([cx + 0.34, cy, 0.32, 1]);
        }
        break;

      default:
        break;
    }
  }

  for (const dart of state.darts) {
    if (dart.alive) rects.push([dart.x, dart.y + 0.3, 0.5, 0.36]);
  }

  return rects;
}

// ─── Trap simulation ─────────────────────────────────────────────────────────

/** Plunge (accelerating), hang, then retract. Returns 0..1 extension. */
function crushEnvelope(p: number): number {
  if (p < CRUSH_TIME) {
    const k = p / CRUSH_TIME;
    return k * k;
  }
  if (p < CRUSH_TIME + CRUSH_HOLD) return 1;
  const k = Math.min((p - CRUSH_TIME - CRUSH_HOLD) / CRUSH_RETRACT, 1);
  return 1 - k;
}

function updateTraps(state: GameState, dt: number) {
  const pr = playerRect(state.player);

  for (const ts of state.traps) {
    const { def } = ts;

    // Lasers are never "armed" — they cycle from the moment the level loads.
    if (def.kind === "laser") {
      const period = def.period ?? 2;
      const phase = def.phase ?? 0;
      ts.t += dt;
      const cycle = (ts.t + phase) % period;
      ts.on = cycle < period * 0.45;
      // A short warning flicker before the beam lands — otherwise it is a coin flip.
      ts.amount = ts.on ? 1 : cycle > period - 0.35 ? 0.35 : 0;
      continue;
    }

    if (!ts.armed) {
      if (!def.trigger) ts.armed = true;
      else if (overlaps(pr[0], pr[1], pr[2], pr[3], def.trigger)) {
        ts.armed = true;
      } else {
        continue;
      }
    }

    ts.t += dt;
    const delay = def.delay ?? 0;
    if (ts.t < delay) continue;
    ts.p = ts.t - delay;

    if (!ts.fired) {
      ts.fired = true;
      state.events.push(def.kind);
      state.shake = Math.max(state.shake, def.kind === "crusher" ? 0.5 : 0.22);

      switch (def.kind) {
        case "fallFloor":
        case "slideFloor":
          // Stop being ground immediately; the renderer animates the debris.
          for (const [cx, cy] of def.cells) state.removed.add(key(cx, cy));
          break;
        case "runawayDoor":
          if (def.target) {
            state.exit.tx = def.target[0];
            state.exit.ty = def.target[1];
          }
          break;
        case "dart":
          for (const [cx, cy] of def.cells) {
            state.darts.push({ x: cx, y: cy, dir: def.dir ?? -1, alive: true });
          }
          break;
        default:
          break;
      }
    }

    switch (def.kind) {
      case "spikeUp":
        ts.amount = Math.min(ts.p / SPIKE_RISE, 1);
        break;

      case "spikeDown":
        // Same timing envelope as a crusher: plunge, hang there, grind back up.
        ts.amount = crushEnvelope(ts.p);
        break;

      case "riseWall": {
        ts.amount = Math.min(ts.p / WALL_RISE, 1);
        if (ts.amount >= 0.6) {
          for (const [cx, cy] of def.cells) state.added.add(key(cx, cy));
        }
        break;
      }

      case "crusher":
        ts.amount = crushEnvelope(ts.p);
        break;

      case "fallFloor":
        ts.amount = 0.5 * GRAVITY * ts.p * ts.p;
        break;

      case "slideFloor":
        ts.amount = SLIDE_SPEED * ts.p;
        break;

      default:
        ts.amount = Math.min(ts.p * 3, 1);
        break;
    }
  }

  // Darts
  for (const dart of state.darts) {
    if (!dart.alive) continue;
    dart.x += dart.dir * DART_SPEED * dt;
    if (dart.x < 0.2 || dart.x > TILE_COLS - 1.2) dart.alive = false;
    else if (isSolid(state, Math.floor(dart.x + 0.25), Math.floor(dart.y + 0.5))) dart.alive = false;
  }

  // Runaway door easing
  state.exit.x += (state.exit.tx - state.exit.x) * Math.min(dt * 6, 1);
  state.exit.y += (state.exit.ty - state.exit.y) * Math.min(dt * 6, 1);
}

// ─── Player movement ─────────────────────────────────────────────────────────

function moveAxis(state: GameState, axis: "x" | "y", amount: number) {
  const p = state.player;
  if (amount === 0) return;

  p[axis] += amount;

  const x0 = Math.floor(p.x);
  const x1 = Math.floor(p.x + PLAYER_W - 1e-6);
  const y0 = Math.floor(p.y);
  const y1 = Math.floor(p.y + PLAYER_H - 1e-6);

  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      if (!isSolid(state, tx, ty)) continue;

      if (axis === "x") {
        if (amount > 0) p.x = tx - PLAYER_W;
        else p.x = tx + 1;
        p.vx = 0;
      } else {
        if (amount > 0) {
          p.y = ty - PLAYER_H;
          p.onGround = true;
        } else {
          p.y = ty + 1;
        }
        p.vy = 0;
      }
      return;
    }
  }
}

function updatePlayer(state: GameState, dt: number, input: Input) {
  const p = state.player;

  // Horizontal
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (dir !== 0) {
    p.facing = dir;
    const accel = p.onGround ? GROUND_ACCEL : AIR_ACCEL;
    p.vx += dir * accel * dt;
    p.vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, p.vx));
  } else if (p.onGround) {
    const drop = GROUND_FRICTION * dt;
    p.vx = Math.abs(p.vx) <= drop ? 0 : p.vx - Math.sign(p.vx) * drop;
  }

  // Jump — coyote time and an input buffer keep it forgiving, which matters a
  // lot when every level is trying to kill you anyway.
  p.coyote = p.onGround ? COYOTE_TIME : Math.max(0, p.coyote - dt);
  if (input.jump && !p.wasJump) p.buffer = JUMP_BUFFER;
  else p.buffer = Math.max(0, p.buffer - dt);

  if (p.buffer > 0 && p.coyote > 0) {
    p.vy = -JUMP_VELOCITY;
    p.onGround = false;
    p.coyote = 0;
    p.buffer = 0;
    state.events.push("jump");
  }

  // Releasing jump early gives a shorter hop.
  if (!input.jump && p.vy < 0) p.vy *= Math.pow(JUMP_CUT, dt * 60);

  p.wasJump = input.jump;

  p.vy = Math.min(p.vy + GRAVITY * dt, MAX_FALL);
  p.onGround = false;

  moveAxis(state, "x", p.vx * dt);
  moveAxis(state, "y", p.vy * dt);
}

// ─── Death & win ─────────────────────────────────────────────────────────────

function kill(state: GameState) {
  if (state.status !== "playing") return;
  state.status = "dead";
  state.deathTimer = RESPAWN_DELAY;
  state.deaths += 1;
  state.levelDeaths += 1;
  state.shake = 0.8;
  state.flash = 1;
  state.events.push("death");
}

/**
 * Every rect that kills on contact this frame, static and trap-driven.
 * Exported so tooling (and the solvability test) can reason about a level
 * without re-deriving the trap rules.
 */
export function hazardRects(state: GameState): Rect[] {
  return [...staticSpikeRects(state), ...trapHazards(state)];
}

function checkFatal(state: GameState) {
  const p = state.player;
  if (p.y > TILE_ROWS + 1.5) {
    kill(state);
    return;
  }

  for (const r of hazardRects(state)) {
    if (overlaps(p.x + 0.06, p.y + 0.06, PLAYER_W - 0.12, PLAYER_H - 0.12, r)) {
      kill(state);
      return;
    }
  }
}

function checkWin(state: GameState) {
  const p = state.player;
  const e = state.exit;
  if (overlaps(p.x, p.y, PLAYER_W, PLAYER_H, [e.x + 0.1, e.y - 0.05, 0.8, 1.05])) {
    state.status = "won";
    state.events.push("win");
  }
}

// ─── Fixed-timestep driver ───────────────────────────────────────────────────

const FIXED_DT = 1 / 120;

/**
 * Advances the simulation by `elapsed` seconds in fixed sub-steps so physics
 * behave the same on a 60Hz laptop and a 120Hz phone. Returns the state so
 * callers can pick up a fresh object after a respawn.
 */
export function step(state: GameState, elapsed: number, input: Input): GameState {
  let current = state;
  current.events.length = 0;

  // A tab that was backgrounded can hand us a multi-second delta; cap it rather
  // than simulating hundreds of steps (or tunnelling through the floor).
  let remaining = Math.min(elapsed, 0.25);

  while (remaining > 0) {
    const dt = Math.min(FIXED_DT, remaining);
    remaining -= dt;

    current.time += dt;
    current.shake = Math.max(0, current.shake - dt * 2.2);
    current.flash = Math.max(0, current.flash - dt * 2.6);

    if (current.status === "playing") {
      updatePlayer(current, dt, input);
      updateTraps(current, dt);
      checkFatal(current);
      if (current.status === "playing") checkWin(current);
    } else if (current.status === "dead") {
      updateTraps(current, dt);
      current.deathTimer -= dt;
      if (current.deathTimer <= 0) {
        const events = current.events;
        current = respawn(current);
        current.events = events;
        current.events.push("respawn");
      }
    }
  }

  return current;
}

export { LEVELS, TILE_COLS, TILE_ROWS };
