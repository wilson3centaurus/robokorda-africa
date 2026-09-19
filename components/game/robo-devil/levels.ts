/**
 * Level data for Robo Devil.
 *
 * Grids are 40x12 character maps, row 0 at the top:
 *   `#` solid block   `.` empty   `x` fake block (drawn solid, walk straight
 *   through it)       `^` static spike   `S` spawn   `E` exit
 *
 * Traps are the point of the game: almost all of them are dormant until the
 * player crosses their trigger rect, so the first run through a level is
 * supposed to kill you. Levels are designed so every trap is survivable once
 * you know it is there — no ground gap is wider than a full-speed jump.
 */

export const TILE_COLS = 40;
export const TILE_ROWS = 12;

/** [x, y, width, height] in tile coordinates. */
export type Rect = [number, number, number, number];
export type Cell = [number, number];

export type TrapKind =
  | "fallFloor"
  | "slideFloor"
  | "spikeUp"
  | "spikeDown"
  | "crusher"
  | "riseWall"
  | "runawayDoor"
  | "dart"
  | "laser";

export type TrapDef = {
  kind: TrapKind;
  cells: Cell[];
  /** Player must overlap this to arm the trap. Omitted for always-on traps. */
  trigger?: Rect;
  /** Seconds between arming and firing. */
  delay?: number;
  /** crusher: how many tiles it slams down. */
  drop?: number;
  /** slideFloor / dart: travel direction along x. */
  dir?: number;
  /** laser: full on+off cycle length in seconds. */
  period?: number;
  /** laser: offset into the cycle, so a row of lasers alternates. */
  phase?: number;
  /** runawayDoor: where the exit runs to. */
  target?: Cell;
};

export type LevelDef = {
  name: string;
  taunt: string;
  grid: string[];
  traps: TrapDef[];
};

export const LEVELS: LevelDef[] = [
  {
    name: "Boot Sequence",
    taunt: "The floor was never your friend.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#...........####.......................#",
      "#......................................#",
      "#......................................#",
      "#.S.................................E..#",
      "########################################",
      "#......................................#",
    ],
    traps: [
      { kind: "fallFloor", cells: [[17, 10], [18, 10], [19, 10]], trigger: [13, 6, 4, 5], delay: 0.0 },
    ],
  },
  {
    name: "Trust Issues",
    taunt: "Not everything that looks solid is.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#.....###..............................#",
      "#......................................#",
      "#.........................xx...........#",
      "#.S.................................E..#",
      "#########################....###########",
      "#......................................#",
    ],
    traps: [
      { kind: "spikeUp", cells: [[12, 9], [13, 9]], trigger: [8, 5, 4, 6], delay: 0.0 },
      { kind: "spikeUp", cells: [[19, 9]], trigger: [16, 5, 3, 6], delay: 0.05 },
    ],
  },
  {
    name: "Ceiling Fan",
    taunt: "Mind your head. And everything else.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#..............####....................#",
      "#......................................#",
      "#......................................#",
      "#.S.................................E..#",
      "####################...#################",
      "#......................................#",
    ],
    traps: [
      { kind: "crusher", cells: [[11, 1]], trigger: [7, 4, 4, 7], delay: 0.12, drop: 8 },
      { kind: "crusher", cells: [[27, 1]], trigger: [24, 4, 3, 7], delay: 0.1, drop: 8 },
      { kind: "spikeDown", cells: [[32, 1], [33, 1]], trigger: [28, 4, 3, 7], delay: 0.0, drop: 8 },
    ],
  },
  {
    name: "The Long Jump",
    taunt: "Stepping stones have places to be.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#.......................####...........#",
      "#......................................#",
      "#.............##.......................#",
      "#.S.................................E..#",
      "#############....#######################",
      "#......................................#",
    ],
    traps: [
      { kind: "slideFloor", cells: [[14, 8], [15, 8]], trigger: [10, 5, 3, 6], delay: 0.0, dir: 1 },
      { kind: "dart", cells: [[37, 9]], trigger: [22, 5, 4, 6], delay: 0.15, dir: -1 },
      { kind: "dart", cells: [[37, 8]], trigger: [28, 5, 3, 6], delay: 0.1, dir: -1 },
    ],
  },
  {
    name: "Laser Etiquette",
    taunt: "Timing is a skill. Get some.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#.......###............................#",
      "#...................####...............#",
      "#......................................#",
      "#.S.................................E..#",
      "########################################",
      "#......................................#",
    ],
    traps: [
      { kind: "laser", cells: [[13, 6], [13, 7], [13, 8], [13, 9]], period: 2.1, phase: 0.0 },
      { kind: "laser", cells: [[18, 6], [18, 7], [18, 8], [18, 9]], period: 2.1, phase: 0.7 },
      { kind: "laser", cells: [[27, 6], [27, 7], [27, 8], [27, 9]], period: 2.1, phase: 1.4 },
      { kind: "riseWall", cells: [[32, 9], [32, 8]], trigger: [28, 4, 3, 7], delay: 0.0 },
    ],
  },
  {
    name: "Exit Denied",
    taunt: "The door has other plans.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#.................................###..#",
      "#......................................#",
      "#.............................###......#",
      "#.S.......................E............#",
      "#################...####################",
      "#......................................#",
    ],
    traps: [
      { kind: "spikeUp", cells: [[9, 9], [10, 9]], trigger: [5, 5, 4, 6], delay: 0.0 },
      { kind: "runawayDoor", cells: [], trigger: [22, 4, 4, 7], delay: 0.0, target: [35, 5] },
      { kind: "fallFloor", cells: [[30, 8], [31, 8]], trigger: [28, 6, 2, 3], delay: 0.35 },
    ],
  },
  {
    name: "Gravity Bills",
    taunt: "Everything you stand on is a loan.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#............................###.......#",
      "#..............####....................#",
      "#......................................#",
      "#.S.................................E..#",
      "##########...##########...##############",
      "#......................................#",
    ],
    traps: [
      { kind: "fallFloor", cells: [[5, 10], [6, 10]], trigger: [2, 6, 3, 5], delay: 0.1 },
      { kind: "slideFloor", cells: [[16, 7], [17, 7]], trigger: [13, 4, 3, 5], delay: 0.25, dir: -1 },
      { kind: "crusher", cells: [[20, 1]], trigger: [17, 4, 3, 7], delay: 0.08, drop: 8 },
      { kind: "spikeUp", cells: [[33, 9], [34, 9]], trigger: [30, 5, 3, 6], delay: 0.0 },
      { kind: "dart", cells: [[38, 9]], trigger: [26, 5, 4, 6], delay: 0.25, dir: -1 },
    ],
  },
  {
    name: "The Build Server",
    taunt: "It was green a second ago. Honest.",
    grid: [
      "########################################",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#..................####................#",
      "#......###.......................###...#",
      "#......................................#",
      "#.S..................................E.#",
      "############...#########################",
      "#......................................#",
    ],
    traps: [
      { kind: "spikeUp", cells: [[5, 9]], trigger: [2, 5, 3, 6], delay: 0.0 },
      { kind: "slideFloor", cells: [[8, 7], [9, 7]], trigger: [6, 4, 2, 4], delay: 0.3, dir: 1 },
      { kind: "crusher", cells: [[21, 1]], trigger: [16, 4, 3, 7], delay: 0.1, drop: 8 },
      { kind: "laser", cells: [[24, 6], [24, 7], [24, 8], [24, 9]], period: 1.7, phase: 0.0 },
      { kind: "fallFloor", cells: [[25, 10], [26, 10], [27, 10]], trigger: [22, 6, 3, 5], delay: 0.05 },
      { kind: "spikeDown", cells: [[33, 1], [34, 1]], trigger: [30, 4, 3, 7], delay: 0.1, drop: 8 },
      { kind: "riseWall", cells: [[36, 9]], trigger: [33, 4, 3, 7], delay: 0.2 },
    ],
  },
];

/** Shown on the death overlay — rotates so repeated deaths stay funny. */
export const DEATH_LINES = [
  "Skill issue.",
  "That one was free.",
  "Now you know.",
  "The robot regrets nothing.",
  "Debugging is just dying with extra steps.",
  "Have you tried not doing that?",
  "Compiling… your mistakes.",
  "Stack overflow. Literally.",
  "It worked on my machine.",
  "Somewhere, a facilitator is shaking their head.",
];
