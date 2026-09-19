/**
 * Tiny synthesised sound effects for Robo Devil.
 *
 * Oscillators rather than audio files: no network requests, no licensing, and
 * the whole kit is a few hundred bytes. The context is created lazily on the
 * first user gesture because browsers refuse to start audio before one.
 */

type Sound = "jump" | "land" | "death" | "win" | "trap" | "click";

let ctx: AudioContext | null = null;
let muted = false;

type WindowWithLegacyAudio = Window & { webkitAudioContext?: typeof AudioContext };

export function unlockAudio() {
  if (ctx || typeof window === "undefined") return;
  const Ctor = window.AudioContext ?? (window as WindowWithLegacyAudio).webkitAudioContext;
  if (!Ctor) return;
  try {
    ctx = new Ctor();
  } catch {
    ctx = null;
  }
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function tone(opts: {
  type: OscillatorType;
  from: number;
  to: number;
  duration: number;
  gain: number;
  delay?: number;
}) {
  if (!ctx || muted) return;
  const start = ctx.currentTime + (opts.delay ?? 0);
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.from, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(opts.to, 1), start + opts.duration);

  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(opts.gain, start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + opts.duration);

  osc.connect(amp).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + opts.duration + 0.02);
}

export function play(sound: Sound) {
  if (!ctx || muted) return;
  if (ctx.state === "suspended") void ctx.resume();

  switch (sound) {
    case "jump":
      tone({ type: "square", from: 320, to: 680, duration: 0.11, gain: 0.05 });
      break;
    case "land":
      tone({ type: "sine", from: 200, to: 90, duration: 0.09, gain: 0.05 });
      break;
    case "trap":
      tone({ type: "sawtooth", from: 180, to: 60, duration: 0.2, gain: 0.07 });
      break;
    case "death":
      tone({ type: "sawtooth", from: 420, to: 55, duration: 0.42, gain: 0.09 });
      tone({ type: "square", from: 180, to: 40, duration: 0.5, gain: 0.05, delay: 0.05 });
      break;
    case "win":
      [523, 659, 784, 1047].forEach((f, i) =>
        tone({ type: "triangle", from: f, to: f, duration: 0.16, gain: 0.07, delay: i * 0.09 }),
      );
      break;
    case "click":
      tone({ type: "square", from: 520, to: 700, duration: 0.05, gain: 0.04 });
      break;
  }
}
