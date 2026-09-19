"use client";

import { useSyncExternalStore } from "react";
import { detectProfile, type DeviceProfile } from "@/lib/webgl";

/**
 * What the server renders and what the client renders on its hydration pass.
 * "off" means no canvas, so the markup matches on both sides and the real tier
 * only arrives once React is live.
 */
const SSR_PROFILE: DeviceProfile = {
  tier: "off",
  dpr: [1, 1],
  touch: false,
  reducedMotion: false,
};

let snapshot: DeviceProfile | null = null;

function getSnapshot(): DeviceProfile {
  // Cached because useSyncExternalStore requires a stable reference between
  // calls — re-probing here would loop forever.
  if (!snapshot) snapshot = detectProfile();
  return snapshot;
}

function getServerSnapshot(): DeviceProfile {
  return SSR_PROFILE;
}

function subscribe(onChange: () => void) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = window.matchMedia("(pointer: coarse)");
  const handler = () => {
    snapshot = detectProfile();
    onChange();
  };
  motion.addEventListener("change", handler);
  pointer.addEventListener("change", handler);
  return () => {
    motion.removeEventListener("change", handler);
    pointer.removeEventListener("change", handler);
  };
}

/** Resolves the device's 3D quality tier, re-reading it if the user's settings change. */
export function useDeviceProfile(): DeviceProfile {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
