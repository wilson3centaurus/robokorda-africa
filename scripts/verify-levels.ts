/**
 * Headless solvability check for Robo Devil.
 *
 * Drives the real engine with a bot that can run, jump obstacles, wait for a
 * hazard to clear, and jump one it can see (standing in for a player who has
 * already died to that trap once). If this bot finishes a level within a few
 * hundred attempts, a human can.
 */
import {
  createState, step, hazardRects, PLAYER_W, PLAYER_H, isSolid,
  type GameState, type Input,
} from "../components/game/robo-devil/engine";
import { LEVELS } from "../components/game/robo-devil/levels";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function overlaps(ax: number, ay: number, aw: number, ah: number, b: number[]) {
  return ax < b[0] + b[2] && ax + aw > b[0] && ay < b[1] + b[3] && ay + ah > b[1];
}

function attempt(levelIndex: number, seed: number, maxSeconds = 60) {
  let state: GameState = createState(levelIndex);
  const rand = rng(seed);
  const dt = 1 / 60;
  let jumpHold = 0;
  /**
   * How long we have been stalled in front of a hazard. Transient traps
   * (lasers, crushers) clear if you wait; permanent ones (spikes) do not, so
   * after a couple of seconds the bot commits to jumping instead.
   */
  let stall = 0;
  let deaths = 0;
  let best = state.player.x;

  for (let frame = 0; frame < maxSeconds * 60; frame++) {
    const p = state.player;
    const footY = Math.floor(p.y + PLAYER_H + 0.1);
    const aheadX = Math.floor(p.x + PLAYER_W + 0.35);
    const midY = Math.floor(p.y + PLAYER_H / 2);

    const wallAhead =
      isSolid(state, aheadX, midY) ||
      isSolid(state, aheadX, Math.floor(p.y + 0.1)) ||
      isSolid(state, aheadX + 1, midY);
    const gapAhead =
      !isSolid(state, aheadX, footY) && !isSolid(state, Math.floor(p.x + PLAYER_W + 1.2), footY);

    const hazardAhead = hazardRects(state).some((h) =>
      overlaps(p.x + PLAYER_W * 0.5, p.y - 2.6, 2.4, PLAYER_H + 3.2, h),
    );

    let right = true;
    let jump = false;

    if (jumpHold > 0) {
      jump = true;
      jumpHold -= dt;
    } else if (hazardAhead && p.onGround && stall < 2.6) {
      // Hold position and see whether the thing in front of us goes away.
      right = false;
      stall += dt;
    } else if (p.onGround && (wallAhead || gapAhead || hazardAhead)) {
      jumpHold = 0.2 + rand() * 0.2;
      jump = true;
      stall = 0;
    } else if (p.onGround && rand() < 0.01) {
      jumpHold = 0.12 + rand() * 0.25;
      jump = true;
    }

    if (!hazardAhead) stall = Math.max(0, stall - dt * 2);

    const input: Input = { left: false, right, jump };
    const before = state.deaths;
    state = step(state, dt, input);
    if (state.deaths > before) { deaths++; jumpHold = 0; stall = 0; }
    best = Math.max(best, state.player.x);

    if (state.status === "won") return { won: true, deaths, frames: frame, best };
  }
  return { won: false, deaths, frames: maxSeconds * 60, best };
}

const MAX_ATTEMPTS = Number(process.env.ATTEMPTS ?? 300);
let allOk = true;

for (let i = 0; i < LEVELS.length; i++) {
  let won = false;
  let tries = 0;
  let bestReach = 0;
  let totalDeaths = 0;
  for (let seed = 1; seed <= MAX_ATTEMPTS && !won; seed++) {
    const r = attempt(i, seed * 7919);
    tries = seed;
    bestReach = Math.max(bestReach, r.best);
    totalDeaths += r.deaths;
    if (r.won) won = true;
  }
  if (!won) allOk = false;
  console.log(
    `${won ? "PASS" : "FAIL"}  L${i + 1} ${LEVELS[i].name.padEnd(18)} ` +
    `attempts=${String(tries).padStart(4)} furthest_x=${bestReach.toFixed(1)} bot_deaths=${totalDeaths}`,
  );
}

console.log(allOk ? "\nAll levels beatable." : "\nSOME LEVELS UNBEATABLE");
process.exit(allOk ? 0 : 1);
