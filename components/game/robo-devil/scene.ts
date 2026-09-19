/**
 * Robo Devil — three.js renderer.
 *
 * Owns every GPU resource for the game and draws a `GameState` each frame.
 * It never mutates game state; the simulation in `engine.ts` is the only
 * source of truth.
 */

import * as THREE from "three";
import { TILE_COLS, TILE_ROWS, type LevelDef } from "./levels";
import { PLAYER_H, PLAYER_W, type GameState } from "./engine";

const ELECTRIC = 0x342fc5;
const ELECTRIC_BRIGHT = 0x7472ee;
const NEON = 0x00e5a0;
const DANGER = 0xff3b5c;
const BLOCK = 0x2a2e5c;

const FOV = 42;
const BURST_COUNT = 16;
const MAX_DARTS = 8;

/** Grid y grows downward; the three.js scene grows upward. */
const worldY = (gridY: number) => -gridY;

type BlockRef = { index: number; base: THREE.Vector3; capped: boolean };

export class RoboDevilScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private root = new THREE.Group();

  private blocks: THREE.InstancedMesh | null = null;
  private blockTops: THREE.InstancedMesh | null = null;
  private blockIndex = new Map<string, BlockRef>();

  private spikes: THREE.Mesh[] = [];
  private trapSpikes = new Map<number, THREE.Mesh[]>();
  private crushers = new Map<number, THREE.Mesh[]>();
  private lasers = new Map<number, THREE.Mesh[]>();
  private riseWalls = new Map<number, THREE.Mesh[]>();

  private darts: THREE.Mesh[] = [];
  private burst: THREE.Mesh[] = [];
  private burstLife = 0;

  private player = new THREE.Group();
  private playerLight: THREE.PointLight;
  private exit = new THREE.Group();
  private exitPortal: THREE.Mesh | null = null;

  private levelGroup = new THREE.Group();
  /** Shared furniture — lives for the whole session. */
  private disposables: Array<{ dispose: () => void }> = [];
  /** Rebuilt on every `loadLevel`, so it is disposed on every `loadLevel`. */
  private levelDisposables: Array<{ dispose: () => void }> = [];

  private narrow = false;
  /** Pushes the player up the frame so on-screen controls do not sit on them. */
  private viewBias = 0;
  private dpr: number;

  constructor(private container: HTMLElement, opts: { dpr: number; antialias: boolean }) {
    this.dpr = opts.dpr;
    this.renderer = new THREE.WebGLRenderer({
      antialias: opts.antialias,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(opts.dpr);
    this.renderer.setClearColor(0x06070f, 1);
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
    this.scene.fog = new THREE.Fog(0x06070f, 26, 52);
    this.scene.add(this.root);
    this.root.add(this.levelGroup);

    this.buildLights();
    this.buildBackdrop();
    this.buildPlayer();
    this.buildExit();
    this.buildPools();

    this.playerLight = new THREE.PointLight(NEON, 14, 9);
    this.root.add(this.playerLight);

    this.resize();
  }

  /** Vertical framing offset in tiles; used when touch controls are showing. */
  setViewBias(units: number) {
    this.viewBias = units;
  }

  // ── Static furniture ──────────────────────────────────────────────────────

  private track<T extends { dispose: () => void }>(item: T): T {
    this.disposables.push(item);
    return item;
  }

  private buildLights() {
    this.scene.add(new THREE.AmbientLight(0x9ea2ff, 1.05));

    const key = new THREE.DirectionalLight(0xdfe3ff, 1.9);
    key.position.set(6, 10, 14);
    this.scene.add(key);

    const rim = new THREE.PointLight(ELECTRIC, 40, 44);
    rim.position.set(0, -4, 10);
    this.scene.add(rim);
  }

  private buildBackdrop() {
    // Starfield
    const count = 280;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = -14 - Math.random() * 24;
    }
    const geo = this.track(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = this.track(
      new THREE.PointsMaterial({
        size: 0.22,
        color: ELECTRIC_BRIGHT,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.scene.add(new THREE.Points(geo, mat));

    // Circuit grid far behind the action
    const grid = new THREE.GridHelper(120, 60, ELECTRIC, 0x191b36);
    grid.rotation.x = Math.PI / 2;
    grid.position.set(TILE_COLS / 2, -TILE_ROWS / 2, -10);
    const gridMat = grid.material as THREE.Material | THREE.Material[];
    const applyGrid = (m: THREE.Material) => {
      m.transparent = true;
      m.opacity = 0.2;
    };
    if (Array.isArray(gridMat)) gridMat.forEach(applyGrid);
    else applyGrid(gridMat);
    this.scene.add(grid);
  }

  private buildPlayer() {
    const shell = this.track(new THREE.MeshStandardMaterial({ color: 0x2b2d58, metalness: 0.5, roughness: 0.35 }));
    const glow = this.track(
      new THREE.MeshStandardMaterial({ color: NEON, emissive: NEON, emissiveIntensity: 2.2, toneMapped: false }),
    );
    const visorMat = this.track(
      new THREE.MeshStandardMaterial({ color: 0x06060f, emissive: ELECTRIC, emissiveIntensity: 0.8, metalness: 0.9, roughness: 0.15 }),
    );

    const body = new THREE.Mesh(this.track(new THREE.BoxGeometry(PLAYER_W, PLAYER_H * 0.62, 0.55)), shell);
    body.position.y = -PLAYER_H * 0.34;
    this.player.add(body);

    const head = new THREE.Mesh(this.track(new THREE.BoxGeometry(PLAYER_W * 0.92, PLAYER_H * 0.4, 0.5)), shell);
    head.position.y = -PLAYER_H * 0.82 + PLAYER_H * 0.62;
    this.player.add(head);

    const visor = new THREE.Mesh(this.track(new THREE.BoxGeometry(PLAYER_W * 0.7, PLAYER_H * 0.18, 0.06)), visorMat);
    visor.position.set(0, head.position.y + 0.02, 0.27);
    this.player.add(visor);

    const eyeGeo = this.track(new THREE.SphereGeometry(0.055, 8, 8));
    for (const x of [-0.12, 0.12]) {
      const eye = new THREE.Mesh(eyeGeo, glow);
      eye.position.set(x, head.position.y + 0.02, 0.3);
      this.player.add(eye);
    }

    const core = new THREE.Mesh(this.track(new THREE.SphereGeometry(0.09, 10, 10)), glow);
    core.position.set(0, -PLAYER_H * 0.3, 0.29);
    this.player.add(core);

    // Thruster under the feet — also the landing/jump tell
    const thruster = new THREE.Mesh(this.track(new THREE.ConeGeometry(0.2, 0.36, 10)), glow);
    thruster.rotation.x = Math.PI;
    thruster.position.y = -PLAYER_H * 0.78;
    thruster.name = "thruster";
    this.player.add(thruster);

    this.root.add(this.player);
  }

  private buildExit() {
    const frameMat = this.track(
      new THREE.MeshStandardMaterial({ color: ELECTRIC_BRIGHT, emissive: ELECTRIC_BRIGHT, emissiveIntensity: 1.1, toneMapped: false }),
    );
    const frameGeo = this.track(new THREE.TorusGeometry(0.52, 0.06, 8, 24));
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = -0.5;
    this.exit.add(frame);

    const portalMat = this.track(
      new THREE.MeshBasicMaterial({ color: NEON, transparent: true, opacity: 0.55, toneMapped: false, side: THREE.DoubleSide }),
    );
    const portal = new THREE.Mesh(this.track(new THREE.CircleGeometry(0.48, 24)), portalMat);
    portal.position.y = -0.5;
    portal.position.z = -0.05;
    this.exitPortal = portal;
    this.exit.add(portal);

    this.root.add(this.exit);
  }

  private buildPools() {
    const dartMat = this.track(
      new THREE.MeshStandardMaterial({ color: DANGER, emissive: DANGER, emissiveIntensity: 2, toneMapped: false }),
    );
    const dartGeo = this.track(new THREE.BoxGeometry(0.5, 0.14, 0.14));
    for (let i = 0; i < MAX_DARTS; i++) {
      const dart = new THREE.Mesh(dartGeo, dartMat);
      dart.visible = false;
      this.darts.push(dart);
      this.root.add(dart);
    }

    const burstMat = this.track(
      new THREE.MeshStandardMaterial({ color: NEON, emissive: NEON, emissiveIntensity: 2, toneMapped: false }),
    );
    const burstGeo = this.track(new THREE.BoxGeometry(0.11, 0.11, 0.11));
    for (let i = 0; i < BURST_COUNT; i++) {
      const piece = new THREE.Mesh(burstGeo, burstMat);
      piece.visible = false;
      piece.userData.dir = new THREE.Vector3(
        Math.cos((i / BURST_COUNT) * Math.PI * 2),
        Math.sin((i / BURST_COUNT) * Math.PI * 2),
        (Math.random() - 0.5) * 0.6,
      );
      this.burst.push(piece);
      this.root.add(piece);
    }
  }

  // ── Level geometry ────────────────────────────────────────────────────────

  loadLevel(level: LevelDef) {
    // Tear down the previous level's meshes, keeping the shared furniture.
    this.levelGroup.clear();
    for (const item of this.levelDisposables) item.dispose();
    this.levelDisposables = [];
    this.blockIndex.clear();
    this.spikes = [];
    this.trapSpikes.clear();
    this.crushers.clear();
    this.lasers.clear();
    this.riseWalls.clear();
    this.blocks?.dispose();
    this.blockTops?.dispose();

    const solids: Array<[number, number]> = [];
    const fakes: Array<[number, number]> = [];
    const staticSpikes: Array<[number, number]> = [];

    for (let y = 0; y < level.grid.length; y++) {
      for (let x = 0; x < level.grid[y].length; x++) {
        const ch = level.grid[y][x];
        if (ch === "#") solids.push([x, y]);
        else if (ch === "x") fakes.push([x, y]);
        else if (ch === "^") staticSpikes.push([x, y]);
      }
    }

    const blockGeo = new THREE.BoxGeometry(1, 1, 1);
    const blockMat = new THREE.MeshStandardMaterial({
      color: BLOCK,
      emissive: 0x11133a,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.68,
    });
    const topGeo = new THREE.BoxGeometry(1, 0.08, 1.02);
    const topMat = new THREE.MeshStandardMaterial({
      color: ELECTRIC_BRIGHT,
      emissive: ELECTRIC_BRIGHT,
      emissiveIntensity: 1.4,
      toneMapped: false,
    });

    // Fake blocks share the exact same materials as real ones. That is the joke.
    const all = [...solids, ...fakes];
    const blocks = new THREE.InstancedMesh(blockGeo, blockMat, all.length);
    const tops = new THREE.InstancedMesh(topGeo, topMat, all.length);
    const m = new THREE.Matrix4();

    all.forEach(([x, y], i) => {
      const base = new THREE.Vector3(x + 0.5, worldY(y) - 0.5, 0);
      m.makeTranslation(base.x, base.y, base.z);
      blocks.setMatrixAt(i, m);

      // Only cap a block when nothing sits directly on top of it.
      const above = level.grid[y - 1]?.[x];
      const capped = above !== "#" && above !== "x";
      m.makeTranslation(base.x, capped ? base.y + 0.5 : base.y + 900, base.z);
      tops.setMatrixAt(i, m);

      this.blockIndex.set(`${x},${y}`, { index: i, base, capped });
    });

    blocks.instanceMatrix.needsUpdate = true;
    tops.instanceMatrix.needsUpdate = true;
    this.blocks = blocks;
    this.blockTops = tops;
    this.levelGroup.add(blocks, tops);

    // Static spikes
    const spikeGeo = new THREE.ConeGeometry(0.3, 0.78, 4);
    const spikeMat = new THREE.MeshStandardMaterial({
      color: DANGER,
      emissive: DANGER,
      emissiveIntensity: 1.1,
      metalness: 0.4,
      roughness: 0.4,
    });
    for (const [x, y] of staticSpikes) {
      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      spike.position.set(x + 0.5, worldY(y) - 0.6, 0);
      this.levelGroup.add(spike);
      this.spikes.push(spike);
    }

    // Trap-owned geometry
    const trapSpikeMat = spikeMat;
    const crusherMat = new THREE.MeshStandardMaterial({
      color: 0x3a1024,
      emissive: DANGER,
      emissiveIntensity: 0.55,
      metalness: 0.6,
      roughness: 0.35,
    });
    const laserMat = new THREE.MeshBasicMaterial({
      color: DANGER,
      transparent: true,
      opacity: 0.85,
      toneMapped: false,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x24264a,
      emissive: ELECTRIC,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.6,
    });

    level.traps.forEach((def, ti) => {
      if (def.kind === "spikeUp" || def.kind === "spikeDown") {
        const meshes = def.cells.map(([x, y]) => {
          const spike = new THREE.Mesh(spikeGeo, trapSpikeMat);
          if (def.kind === "spikeDown") spike.rotation.z = Math.PI;
          spike.position.set(x + 0.5, worldY(y) - 0.5, 0);
          spike.visible = def.kind === "spikeDown";
          this.levelGroup.add(spike);
          return spike;
        });
        this.trapSpikes.set(ti, meshes);
      }

      if (def.kind === "crusher") {
        const meshes = def.cells.map(([x, y]) => {
          const box = new THREE.Mesh(blockGeo, crusherMat);
          box.scale.set(0.98, 1, 0.98);
          box.position.set(x + 0.5, worldY(y) - 0.5, 0);
          this.levelGroup.add(box);
          return box;
        });
        this.crushers.set(ti, meshes);
      }

      if (def.kind === "laser") {
        const meshes = def.cells.map(([x, y]) => {
          const beam = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1, 0.16), laserMat);
          beam.position.set(x + 0.5, worldY(y) - 0.5, 0);
          beam.visible = false;
          this.levelGroup.add(beam);
          return beam;
        });
        this.lasers.set(ti, meshes);
      }

      if (def.kind === "riseWall") {
        const meshes = def.cells.map(([x, y]) => {
          const box = new THREE.Mesh(blockGeo, wallMat);
          box.position.set(x + 0.5, worldY(y) - 0.5, 0);
          box.visible = false;
          this.levelGroup.add(box);
          return box;
        });
        this.riseWalls.set(ti, meshes);
      }
    });

    this.levelDisposables.push(
      blockGeo, blockMat, topGeo, topMat, spikeGeo, spikeMat,
      crusherMat, laserMat, wallMat,
    );
  }

  /**
   * Puts every trap-driven mesh back where it started.
   *
   * Called on respawn instead of rebuilding the level: deaths are frequent and
   * frequent enough that re-allocating geometry would be felt as a hitch.
   */
  resetDynamic() {
    const m = new THREE.Matrix4();
    if (this.blocks && this.blockTops) {
      for (const ref of this.blockIndex.values()) {
        m.makeTranslation(ref.base.x, ref.base.y, ref.base.z);
        this.blocks.setMatrixAt(ref.index, m);
        m.makeTranslation(ref.base.x, ref.capped ? ref.base.y + 0.5 : ref.base.y + 900, ref.base.z);
        this.blockTops.setMatrixAt(ref.index, m);
      }
      this.blocks.instanceMatrix.needsUpdate = true;
      this.blockTops.instanceMatrix.needsUpdate = true;
    }
    for (const meshes of this.trapSpikes.values()) meshes.forEach((mesh) => { mesh.visible = false; });
    for (const meshes of this.riseWalls.values()) meshes.forEach((mesh) => { mesh.visible = false; });
    for (const meshes of this.lasers.values()) meshes.forEach((mesh) => { mesh.visible = false; });
    for (const mesh of this.darts) mesh.visible = false;
    this.burstLife = 0;
  }

  // ── Frame ─────────────────────────────────────────────────────────────────

  private applyTraps(state: GameState) {
    const m = new THREE.Matrix4();

    state.traps.forEach((ts, ti) => {
      const { def } = ts;

      switch (def.kind) {
        case "fallFloor": {
          if (!ts.fired || !this.blocks) break;
          def.cells.forEach(([x, y], i) => {
            const ref = this.blockIndex.get(`${x},${y}`);
            if (!ref) return;
            const spin = ts.p * (1.6 + i * 0.4);
            m.makeRotationZ(spin * 0.6);
            m.setPosition(ref.base.x, ref.base.y - ts.amount, ref.base.z);
            this.blocks!.setMatrixAt(ref.index, m);
            // Park the cap far off-screen the moment the tile lets go.
            this.blockTops!.setMatrixAt(ref.index, new THREE.Matrix4().makeTranslation(0, 900, 0));
          });
          this.blocks.instanceMatrix.needsUpdate = true;
          if (this.blockTops) this.blockTops.instanceMatrix.needsUpdate = true;
          break;
        }

        case "slideFloor": {
          if (!ts.fired || !this.blocks) break;
          const dir = def.dir ?? 1;
          def.cells.forEach(([x, y]) => {
            const ref = this.blockIndex.get(`${x},${y}`);
            if (!ref) return;
            m.makeTranslation(ref.base.x + dir * ts.amount, ref.base.y, ref.base.z);
            this.blocks!.setMatrixAt(ref.index, m);
            this.blockTops!.setMatrixAt(
              ref.index,
              new THREE.Matrix4().makeTranslation(ref.base.x + dir * ts.amount, ref.base.y + 0.5, ref.base.z),
            );
          });
          this.blocks.instanceMatrix.needsUpdate = true;
          if (this.blockTops) this.blockTops.instanceMatrix.needsUpdate = true;
          break;
        }

        case "spikeUp": {
          const meshes = this.trapSpikes.get(ti);
          if (!meshes) break;
          const out = ts.fired ? ts.amount : 0;
          meshes.forEach((mesh, i) => {
            mesh.visible = out > 0.02;
            const [, cy] = def.cells[i];
            const hidden = worldY(cy) - 1.45;
            const shown = worldY(cy) - 0.6;
            mesh.position.y = hidden + (shown - hidden) * out;
          });
          break;
        }

        case "spikeDown": {
          // A spike block that plunges from the ceiling and retracts.
          const meshes = this.trapSpikes.get(ti);
          if (!meshes) break;
          meshes.forEach((mesh, i) => {
            mesh.visible = true;
            const [, cy] = def.cells[i];
            mesh.position.y = worldY(cy) - 0.5 - ts.amount * (def.drop ?? 8);
          });
          break;
        }

        case "crusher": {
          const meshes = this.crushers.get(ti);
          if (!meshes) break;
          meshes.forEach((mesh, i) => {
            const [, cy] = def.cells[i];
            mesh.position.y = worldY(cy) - 0.5 - ts.amount * (def.drop ?? 6);
          });
          break;
        }

        case "laser": {
          const meshes = this.lasers.get(ti);
          if (!meshes) break;
          meshes.forEach((mesh) => {
            mesh.visible = ts.amount > 0;
            const scale = ts.on ? 1 : 0.28;
            mesh.scale.set(scale, 1, scale);
            (mesh.material as THREE.MeshBasicMaterial).opacity = ts.on ? 0.9 : 0.35;
          });
          break;
        }

        case "riseWall": {
          const meshes = this.riseWalls.get(ti);
          if (!meshes) break;
          meshes.forEach((mesh, i) => {
            mesh.visible = ts.fired;
            const [, cy] = def.cells[i];
            mesh.position.y = worldY(cy) - 0.5 - (1 - ts.amount) * 1.6;
          });
          break;
        }

        default:
          break;
      }
    });

    // Darts
    this.darts.forEach((mesh, i) => {
      const dart = state.darts[i];
      mesh.visible = !!dart?.alive;
      if (dart?.alive) mesh.position.set(dart.x + 0.25, worldY(dart.y) - 0.5, 0);
    });
  }

  private updateCamera(state: GameState, dt: number) {
    const halfFov = THREE.MathUtils.degToRad(FOV) / 2;
    const aspect = this.camera.aspect;

    // Fit both a minimum visible height and width, so a tall phone canvas does
    // not crop the level sideways.
    const targetH = this.narrow ? 7.6 : 10.5;
    const minW = this.narrow ? 12 : 17;
    const z = Math.max(targetH / (2 * Math.tan(halfFov)), minW / (2 * Math.tan(halfFov) * aspect));

    const halfW = z * Math.tan(halfFov) * aspect;
    const halfH = z * Math.tan(halfFov);

    const px = state.player.x + PLAYER_W / 2;
    const py = worldY(state.player.y) - PLAYER_H / 2;

    const cx = THREE.MathUtils.clamp(px, halfW, TILE_COLS - halfW);
    const cy = THREE.MathUtils.clamp(py - this.viewBias, -TILE_ROWS + halfH - this.viewBias, -halfH + 1);

    const damp = Math.min(dt * 7, 1);
    this.camera.position.x += (cx - this.camera.position.x) * damp;
    this.camera.position.y += (cy - this.camera.position.y) * damp;
    this.camera.position.z += (z - this.camera.position.z) * damp;

    if (state.shake > 0.001) {
      const s = state.shake * 0.35;
      this.camera.position.x += (Math.random() - 0.5) * s;
      this.camera.position.y += (Math.random() - 0.5) * s;
    }

    this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0);
  }

  private updatePlayer(state: GameState, time: number, dt: number) {
    const p = state.player;
    const alive = state.status !== "dead";

    this.player.visible = alive;
    this.player.position.set(p.x + PLAYER_W / 2, worldY(p.y) - PLAYER_H / 2 + 0.43, 0);

    // Squash on landing, stretch while rising — cheap but it sells the weight.
    const stretch = THREE.MathUtils.clamp(1 + p.vy * 0.012, 0.82, 1.16);
    this.player.scale.set(2 - stretch, stretch, 1);
    this.player.rotation.y = THREE.MathUtils.damp(this.player.rotation.y, p.facing > 0 ? 0.3 : -0.3, 8, dt);
    this.player.rotation.z = THREE.MathUtils.damp(this.player.rotation.z, -p.vx * 0.02, 8, dt);

    const thruster = this.player.getObjectByName("thruster");
    if (thruster) {
      const heat = p.onGround ? 0.35 : 1;
      thruster.scale.set(heat, heat * (1 + Math.sin(time * 26) * 0.18), heat);
    }

    this.playerLight.position.set(this.player.position.x, this.player.position.y, 2.4);
    this.playerLight.intensity = alive ? 14 : 0;

    // Death burst
    if (state.status === "dead" && this.burstLife <= 0) this.burstLife = 1;
    if (state.status === "playing") this.burstLife = 0;

    if (this.burstLife > 0) {
      this.burstLife = Math.max(0, this.burstLife - dt * 1.7);
      const age = 1 - this.burstLife;
      this.burst.forEach((piece) => {
        piece.visible = true;
        const dir = piece.userData.dir as THREE.Vector3;
        piece.position.set(
          this.player.position.x + dir.x * age * 3.2,
          this.player.position.y + dir.y * age * 3.2 - age * age * 5,
          dir.z * age * 2,
        );
        piece.rotation.x += dt * 6;
        piece.rotation.y += dt * 5;
        piece.scale.setScalar(Math.max(0.01, this.burstLife));
      });
    } else {
      this.burst.forEach((piece) => { piece.visible = false; });
    }
  }

  private updateExit(state: GameState, time: number) {
    this.exit.position.set(state.exit.x + 0.5, worldY(state.exit.y) + 0.5, 0);
    this.exit.rotation.z = Math.sin(time * 1.4) * 0.08;
    if (this.exitPortal) {
      const pulse = 0.45 + Math.sin(time * 3.4) * 0.18;
      (this.exitPortal.material as THREE.MeshBasicMaterial).opacity = pulse;
      this.exitPortal.scale.setScalar(0.94 + Math.sin(time * 3.4) * 0.06);
    }
  }

  render(state: GameState, time: number, dt: number) {
    this.applyTraps(state);
    this.updatePlayer(state, time, dt);
    this.updateExit(state, time);
    this.updateCamera(state, dt);

    // Red-out on death
    const fog = this.scene.fog as THREE.Fog;
    const flash = state.flash;
    fog.color.setRGB(0.024 + flash * 0.45, 0.027 + flash * 0.02, 0.059 + flash * 0.08);
    this.renderer.setClearColor(fog.color, 1);

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const { clientWidth, clientHeight } = this.container;
    if (!clientWidth || !clientHeight) return;
    this.narrow = clientWidth < 700;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(this.dpr, window.devicePixelRatio || 1));
    this.renderer.setSize(clientWidth, clientHeight, false);
  }

  dispose() {
    this.blocks?.dispose();
    this.blockTops?.dispose();
    for (const item of this.levelDisposables) item.dispose();
    this.levelDisposables = [];
    for (const item of this.disposables) item.dispose();
    this.disposables = [];
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose?.();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose?.();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
