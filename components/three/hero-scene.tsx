"use client";
/* eslint-disable react-hooks/immutability -- react-three-fiber drives the scene
   by mutating three.js objects (camera.position, material.emissiveIntensity,
   geometry attributes) inside useFrame. That is the library's whole model; the
   objects are not React state and never feed a render. */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { DeviceProfile } from "@/lib/webgl";

// ─── Palette (mirrors the CSS design tokens) ─────────────────────────────────
const ELECTRIC = "#342FC5";
const ELECTRIC_BRIGHT = "#7472ee";
const NEON = "#00e5a0";
const SHELL = "#2f3160";

/**
 * Pointer + tilt, normalised to roughly -1..1 on each axis.
 *
 * Kept in a plain ref rather than state: it updates on every pointermove and
 * every gyro frame, and nothing should re-render because of it.
 */
type Aim = { x: number; y: number; scroll: number };

function useAim(): React.RefObject<Aim> {
  const aim = useRef<Aim>({ x: 0, y: 0, scroll: 0 });

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      aim.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      aim.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // Phones have no cursor — steer with the gyroscope instead. iOS 13+ needs an
    // explicit permission prompt, which we deliberately never fire; the scene
    // just falls back to its idle drift there.
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      aim.current.x = THREE.MathUtils.clamp(e.gamma / 35, -1, 1);
      aim.current.y = THREE.MathUtils.clamp((e.beta - 45) / 35, -1, 1);
    };

    const onScroll = () => {
      aim.current.scroll = window.scrollY / Math.max(window.innerHeight, 1);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrient);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return aim;
}

/**
 * Seeded PRNG (mulberry32).
 *
 * The scene's scatter is generated during render, so it has to be pure —
 * `Math.random()` would give a different layout on every re-render and break
 * server/client agreement. A fixed seed also means the composition we tuned is
 * the composition everyone sees.
 */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Robot mascot ────────────────────────────────────────────────────────────

function Robot({ aim, tier }: { aim: React.RefObject<Aim>; tier: DeviceProfile["tier"] }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const antenna = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);

    if (root.current) {
      // Idle hover + a slow yaw that follows the pointer/tilt.
      root.current.position.y = Math.sin(t * 0.9) * 0.14;
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        aim.current.x * 0.45,
        3,
        d,
      );
      root.current.rotation.z = THREE.MathUtils.damp(
        root.current.rotation.z,
        -aim.current.x * 0.06,
        3,
        d,
      );
    }

    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, aim.current.x * 0.5, 4, d);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, aim.current.y * 0.3, 4, d);
    }

    if (antenna.current) {
      const mat = antenna.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.6 + Math.sin(t * 4) * 0.9;
    }

    // Gentle counter-swing so the arms read as attached, not welded on.
    if (leftArm.current) leftArm.current.rotation.x = Math.sin(t * 1.1) * 0.18;
    if (rightArm.current) rightArm.current.rotation.x = Math.sin(t * 1.1 + Math.PI) * 0.18;
  });

  const segments = tier === "high" ? 32 : 12;

  return (
    <group ref={root} position={[0, -0.1, 0]} scale={1}>
      {/* Head */}
      <group ref={head} position={[0, 1.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.25, 0.95, 1.0]} />
          <meshStandardMaterial color={SHELL} metalness={0.65} roughness={0.28} />
        </mesh>

        {/* Visor */}
        <mesh position={[0, 0.03, 0.52]}>
          <boxGeometry args={[1.0, 0.44, 0.06]} />
          <meshStandardMaterial
            color="#05060f"
            emissive={ELECTRIC}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Eyes */}
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.56]}>
            <sphereGeometry args={[0.1, segments, segments]} />
            <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
        ))}

        {/* Antenna */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.34, 8]} />
          <meshStandardMaterial color="#6361ad" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh ref={antenna} position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.1, segments, segments]} />
          <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={2} toneMapped={false} />
        </mesh>

        {/* Ear pods */}
        {[-0.69, 0.69].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.14, segments]} />
            <meshStandardMaterial color={ELECTRIC} emissive={ELECTRIC} emissiveIntensity={0.7} metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Neck */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.2, segments]} />
        <meshStandardMaterial color="#4b4a92" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.5, 1.05, 0.85]} />
        <meshStandardMaterial color={SHELL} metalness={0.6} roughness={0.32} />
      </mesh>

      {/* Chest core */}
      <mesh position={[0, 0.12, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.08, segments]} />
        <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={1.7} toneMapped={false} />
      </mesh>

      {/* Arms */}
      {([
        [-0.95, leftArm],
        [0.95, rightArm],
      ] as const).map(([x, ref]) => (
        <group key={x} ref={ref} position={[x, 0.42, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.2, segments, segments]} />
            <meshStandardMaterial color={ELECTRIC} metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.26, 0.68, 0.26]} />
            <meshStandardMaterial color={SHELL} metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.92, 0]}>
            <sphereGeometry args={[0.16, segments, segments]} />
            <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Hover base — the bot has no legs, it floats on a thruster ring */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.55, 0.3, 0.3, segments]} />
        <meshStandardMaterial color="#3a3770" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.06, 8, segments]} />
        <meshStandardMaterial color={ELECTRIC_BRIGHT} emissive={ELECTRIC_BRIGHT} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ─── Orbiting gyroscope rings ────────────────────────────────────────────────

function OrbitRings({ tier }: { tier: DeviceProfile["tier"] }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) a.current.rotation.z = t * 0.35;
    if (b.current) {
      b.current.rotation.x = t * 0.28;
      b.current.rotation.y = t * 0.16;
    }
    if (c.current) c.current.rotation.y = -t * 0.22;
  });

  const seg = tier === "high" ? 96 : 40;

  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={a} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 8, seg]} />
        <meshBasicMaterial color={ELECTRIC_BRIGHT} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[0, 0, Math.PI / 5]}>
        <torusGeometry args={[2.9, 0.012, 8, seg]} />
        <meshBasicMaterial color={NEON} transparent opacity={0.4} toneMapped={false} />
      </mesh>
      {tier === "high" && (
        <mesh ref={c} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.3, 0.01, 8, seg]} />
          <meshBasicMaterial color={ELECTRIC_BRIGHT} transparent opacity={0.25} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

// ─── Drifting particle field ─────────────────────────────────────────────────

function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const rand = makeRandom(0x5eed);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const electric = new THREE.Color(ELECTRIC_BRIGHT);
    const neon = new THREE.Color(NEON);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 22;
      positions[i * 3 + 1] = (rand() - 0.5) * 12;
      positions[i * 3 + 2] = (rand() - 0.5) * 14 - 2;

      const c = rand() > 0.72 ? neon : electric;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const d = Math.min(delta, 0.05);
    points.current.rotation.y += d * 0.02;

    // Slow upward drift; particles wrap around instead of being respawned so the
    // buffer never has to be reallocated.
    const attr = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += d * 0.16;
      if (arr[i] > 6) arr[i] = -6;
    }
    attr.needsUpdate = true;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Holographic video panel ─────────────────────────────────────────────────

function VideoPanel({ src, aim }: { src: string; aim: React.RefObject<Aim> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    // Autoplay can still be refused (data saver, low power mode). The panel then
    // shows the first decoded frame, which beats an empty rectangle.
    void video.play().catch(() => {});

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;

    // Handed straight to the material rather than through state: the texture is
    // an external resource, and swapping it should not re-render the tree.
    const target = material.current;
    if (target) {
      target.map = texture;
      target.color.set("#ffffff");
      target.needsUpdate = true;
    }

    return () => {
      if (target) {
        target.map = null;
        target.needsUpdate = true;
      }
      texture.dispose();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    mesh.current.position.y = 0.55 + Math.sin(t * 0.7 + 1) * 0.08;
    mesh.current.rotation.y = THREE.MathUtils.damp(
      mesh.current.rotation.y,
      -0.42 + aim.current.x * 0.14,
      3,
      d,
    );
  });

  return (
    <group position={[2.5, 2.05, -3.0]}>
      <mesh ref={mesh}>
        <planeGeometry args={[2.9, 1.63]} />
        <meshBasicMaterial ref={material} color="#0b0c1c" toneMapped={false} transparent opacity={0.92} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.55, -0.01]} rotation={[0, -0.42, 0]}>
        <planeGeometry args={[3.04, 1.77]} />
        <meshBasicMaterial color={ELECTRIC_BRIGHT} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ─── Floating data chips ─────────────────────────────────────────────────────

function Chips({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);

  const chips = useMemo(() => {
    const rand = makeRandom(0xc417);
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      radius: 4.2 + rand() * 2.4,
      speed: 0.12 + rand() * 0.22,
      offset: rand() * Math.PI * 2,
      y: (rand() - 0.5) * 3.6,
      size: 0.1 + rand() * 0.16,
      neon: rand() > 0.55,
    }));
  }, [count]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const chip = chips[i];
      if (!chip) return;
      const angle = t * chip.speed + chip.offset;
      child.position.set(Math.cos(angle) * chip.radius, chip.y + Math.sin(t * 0.6 + i) * 0.2, Math.sin(angle) * chip.radius);
      child.rotation.x = t * 0.6 + i;
      child.rotation.y = t * 0.4 + i;
    });
  });

  return (
    <group ref={group}>
      {chips.map((chip) => (
        <mesh key={chip.key}>
          <boxGeometry args={[chip.size, chip.size, chip.size]} />
          <meshStandardMaterial
            color={chip.neon ? NEON : ELECTRIC_BRIGHT}
            emissive={chip.neon ? NEON : ELECTRIC_BRIGHT}
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Camera rig ──────────────────────────────────────────────────────────────

function CameraRig({ aim }: { aim: React.RefObject<Aim> }) {
  const { camera, size } = useThree();

  // From `lg` up the copy sits in the left half of the hero, so the camera aims
  // to the left of the robot and pushes it into the right third. Below that the
  // scene is its own stage above the copy, so it stays centred.
  const wide = size.width >= 1024;
  const focusX = wide ? -3.1 : 0;
  const distance = wide ? 9.4 : 9.2;

  useEffect(() => {
    camera.position.set(focusX, 0.6, distance);
  }, [camera, focusX, distance]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const targetX = focusX + aim.current.x * 0.7;
    const targetY = 0.6 - aim.current.y * 0.45 - aim.current.scroll * 1.2;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.4, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.4, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, distance, 2.4, d);
    camera.lookAt(focusX, 0.1, 0);
  });

  return null;
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({ profile, videoSrc }: { profile: DeviceProfile; videoSrc?: string }) {
  const aim = useAim();
  const high = profile.tier === "high";

  return (
    <>
      <color attach="background" args={["#05050f"]} />
      <fog attach="fog" args={["#05050f", 9, 22]} />

      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} color="#dfe3ff" />
      <directionalLight position={[-5, 2, 4]} intensity={0.8} color={ELECTRIC_BRIGHT} />
      <pointLight position={[-4, 2, 3]} intensity={34} distance={16} color={ELECTRIC} />
      <pointLight position={[3.5, -1.5, 2]} intensity={24} distance={14} color={NEON} />

      <CameraRig aim={aim} />

      <Robot aim={aim} tier={profile.tier} />
      <OrbitRings tier={profile.tier} />
      <Particles count={high ? 900 : 320} />
      <Chips count={high ? 14 : 6} />

      {high && videoSrc && <VideoPanel src={videoSrc} aim={aim} />}

      {/* Grid floor — fog does the fading, so no shader is needed */}
      <gridHelper
        args={[60, high ? 60 : 30, ELECTRIC_BRIGHT, "#232450"]}
        position={[0, -2.4, 0]}
      />
    </>
  );
}

export default function HeroScene({
  profile,
  videoSrc,
  active = true,
}: {
  profile: DeviceProfile;
  videoSrc?: string;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={profile.dpr}
      // Pausing the loop when the hero scrolls out of view is the single biggest
      // battery win on phones.
      frameloop={active ? "always" : "never"}
      gl={{ antialias: profile.tier === "high", powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 46, near: 0.1, far: 60, position: [0.6, 0.6, 7.4] }}
      style={{ touchAction: "pan-y" }}
    >
      <Scene profile={profile} videoSrc={videoSrc} />
    </Canvas>
  );
}
