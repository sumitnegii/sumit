import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useMotionValue, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";

/**
 * Cinematic intro orchestration.
 *
 * The intro is a *timeline*, not a set of entrance animations. Every layer
 * reads the same normalised `camera` motion value (0 → far away, 1 → settled
 * in front of the throne) and applies its own depth factor, so the scene moves
 * as one room with real parallax instead of a zooming image.
 *
 * phase 0 — pure darkness, only ash + a faint warm breath
 * phase 1 — the room emerges from black, camera begins to move
 * phase 2 — firelight catches, the throne resolves out of silhouette
 * phase 3 — a distant dragon presence crosses the far background
 * phase 4 — the room settles after the dragon; silence
 * phase 5 — title sequence
 * phase 6 — complete: navigation + CTA, scene keeps breathing
 *
 * Plays once per browser session; reduced-motion users land on phase 6.
 */
export type IntroPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const SESSION_KEY = "realm-intro-played";

/**
 * Phase schedule (ms from start):
 * Phase 0 (0ms): Shot 01 — Blackness & faint distant embers
 * Phase 1 (600ms): Shot 02 — Throne room emerges from darkness
 * Phase 2 (1400ms): Shot 03 & 04 — Fire wakes & atmospheric depth settles
 * Phase 3 (2200ms): Shot 05 — Identity reveal begins ("House of Code" -> "Sumit Singh")
 * Phase 4 (3200ms): Shot 06 — Single gold light catch & title/quote reveal
 * Phase 5 (4000ms): Shot 07 — Controls arrive ("Enter the Realm" / "View My Chronicles")
 * Phase 6 (4800ms): Shot 08 — Hanging sigil settles, realm fully open by ~5200ms
 */
export const INTRO_SCHEDULE: Array<[IntroPhase, number]> = [
  [1, 600],
  [2, 1400],
  [3, 2200],
  [4, 3200],
  [5, 4000],
  [6, 4800],
];

/** Total duration of the camera move, ms. */
const CAMERA_MS = 5200;
const CAMERA_START = 500;

type IntroValue = {
  phase: IntroPhase;
  done: boolean;
  /** 0 → 1 camera travel, eased with cinematic inertia. */
  camera: MotionValue<number>;
  playing: boolean;
  skip: () => void;
};

const IntroContext = createContext<IntroValue | null>(null);

/** Slow in, slow out — a heavy dolly, not a website zoom. */
function inertia(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const camera = useMotionValue(1);
  const [phase, setPhase] = useState<IntroPhase>(6);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let played = false;
    try {
      if (typeof window !== "undefined") {
        const navEntries = window.performance?.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        const isReload = navEntries && navEntries.length > 0 && navEntries[0]?.type === "reload";
        if (isReload) {
          window.sessionStorage.removeItem(SESSION_KEY);
        }
        played = window.sessionStorage.getItem(SESSION_KEY) === "1";
      }
    } catch {
      played = false;
    }

    if (reduced || played) {
      camera.set(1);
      setPhase(6);
      setReady(true);
      return;
    }

    camera.set(0);
    setPhase(0);
    setPlaying(true);
    setReady(true);

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start - CAMERA_START) / CAMERA_MS));
      camera.set(inertia(t));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const timers = INTRO_SCHEDULE.map(([next, at]) =>
      window.setTimeout(() => {
        setPhase(next);
        if (next === 6) setPlaying(false);
      }, at),
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduced, camera]);

  useEffect(() => {
    if (phase === 6 && ready) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }, [phase, ready]);

  const value = useMemo<IntroValue>(
    () => ({
      phase,
      done: ready && phase === 6,
      camera,
      playing,
      skip: () => {
        if (raf.current) cancelAnimationFrame(raf.current);
        camera.set(1);
        setPhase(6);
        setPlaying(false);
      },
    }),
    [phase, ready, camera, playing],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro(): IntroValue {
  const ctx = useContext(IntroContext);
  if (ctx) return ctx;
  throw new Error("useIntro must be used inside <IntroProvider>");
}
