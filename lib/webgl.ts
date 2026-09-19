/**
 * WebGL capability + quality tiering.
 *
 * Every 3D surface on the site runs through this so a mid-range Android phone
 * never gets handed a desktop-weight scene. The tier decides DPR, particle
 * counts, shadow usage and whether we bother mounting a canvas at all.
 */

export type QualityTier = "off" | "low" | "high";

export type DeviceProfile = {
  tier: QualityTier;
  /** Device pixel ratio clamp for the renderer. */
  dpr: [number, number];
  /** Coarse pointer (touch) — drives control hints and hover behaviour. */
  touch: boolean;
  reducedMotion: boolean;
};

let cachedSupport: boolean | null = null;

/** One-shot WebGL support probe. The throwaway context is released immediately. */
export function supportsWebGL(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    cachedSupport = !!gl;
    if (gl) {
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    }
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

type NavigatorWithHints = Navigator & { deviceMemory?: number };

export function detectProfile(): DeviceProfile {
  if (typeof window === "undefined") {
    return { tier: "off", dpr: [1, 1], touch: false, reducedMotion: false };
  }

  const reducedMotion = prefersReducedMotion();
  const touch = window.matchMedia?.("(pointer: coarse)").matches ?? false;

  if (!supportsWebGL()) {
    return { tier: "off", dpr: [1, 1], touch, reducedMotion };
  }

  const nav = navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const narrow = window.innerWidth < 900;

  // Weak phones and low-memory tablets get the stripped-back scene.
  const weak = cores <= 4 || memory <= 4;
  const tier: QualityTier = weak || narrow ? "low" : "high";

  return {
    tier,
    // Retina phones render 3x the pixels for no visible gain — clamp hard.
    dpr: tier === "high" ? [1, 1.8] : [1, 1.35],
    touch,
    reducedMotion,
  };
}
