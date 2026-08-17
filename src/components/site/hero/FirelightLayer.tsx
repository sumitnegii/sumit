import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIntro } from "@/components/site/intro-context";

/**
 * FirelightLayer — independent fire sources illuminating the room.
 *
 * Each source runs its own irregular intensity signal (three detuned sine
 * waves + a rare gust), driven by a single rAF loop that writes opacity and
 * scale directly to the element. Nothing is in sync, so the left and right
 * braziers never breathe together, and the throne metal catches a moving
 * highlight from the strongest source.
 */
type Source = {
  x: number;
  y: number;
  size: number;
  color: string;
  base: number;
  /** flicker speed multipliers */
  f: [number, number, number];
  phase: number;
};

const SOURCES: Source[] = [
  { x: 13, y: 58, size: 30, color: "var(--ember)", base: 0.55, f: [1.7, 3.1, 6.7], phase: 0 },
  { x: 87, y: 56, size: 28, color: "var(--ember)", base: 0.5, f: [1.3, 2.6, 5.9], phase: 2.4 },
  { x: 31, y: 52, size: 18, color: "var(--gold)", base: 0.34, f: [2.1, 3.9, 7.3], phase: 4.1 },
  { x: 69, y: 51, size: 19, color: "var(--gold)", base: 0.3, f: [1.9, 4.4, 8.1], phase: 5.6 },
  { x: 50, y: 80, size: 46, color: "var(--ember)", base: 0.42, f: [0.9, 2.2, 4.3], phase: 1.2 },
];

export function FirelightLayer() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { phase } = useIntro();
  const refs = useRef<Array<HTMLDivElement | null>>([]);
  const sheenRef = useRef<HTMLDivElement | null>(null);

  const sources = isMobile ? SOURCES.slice(0, 3) : SOURCES;

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const t = (now - start) / 1000;
      sources.forEach((s, i) => {
        const el = refs.current[i];
        if (!el) return;
        const n =
          Math.sin(t * s.f[0] + s.phase) * 0.5 +
          Math.sin(t * s.f[1] + s.phase * 1.7) * 0.3 +
          Math.sin(t * s.f[2] + s.phase * 2.3) * 0.2;
        // rare gust — a log collapses and the light surges
        const gust = Math.max(0, Math.sin(t * 0.23 + s.phase) - 0.985) * 22;
        const k = 1 + n * 0.22 + gust;
        el.style.opacity = String(Math.max(0.05, s.base * k));
        el.style.transform = `translate3d(-50%, -50%, 0) scale(${(1 + n * 0.05 + gust * 0.1).toFixed(4)})`;
      });

      if (sheenRef.current) {
        const drift = Math.sin(t * 0.13) * 8 + Math.sin(t * 0.31) * 2;
        const glow = 0.1 + Math.abs(Math.sin(t * 1.1)) * 0.06;
        sheenRef.current.style.transform = `translate3d(${drift.toFixed(2)}%, 0, 0)`;
        sheenRef.current.style.opacity = String(glow);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, sources]);

  // How much of the room the fire is allowed to light, by phase.
  const strength = phase === 0 ? 0.06 : phase === 1 ? 0.4 : phase === 2 ? 0.85 : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[2600ms] ease-out"
      style={{ opacity: strength, zIndex: 3 }}
    >
      {sources.map((s, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}vmin`,
            height: `${s.size}vmin`,
            transform: "translate3d(-50%, -50%, 0)",
            opacity: s.base,
            background: `radial-gradient(circle, color-mix(in oklab, ${s.color} 22%, transparent), transparent 68%)`,
            filter: "blur(22px)",
            mixBlendMode: "screen",
          }}
        />
      ))}

      {/* Warm bounce off the floor stone */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--ember) 9%, transparent), transparent)",
          mixBlendMode: "screen",
        }}
      />

      {/* Moving highlight across the sword metal of the throne */}
      <div
        ref={sheenRef}
        className="absolute inset-y-0 left-[-10%] w-[120%] will-change-transform"
        style={{
          background:
            "linear-gradient(102deg, transparent 38%, color-mix(in oklab, var(--gold) 40%, transparent) 50%, transparent 62%)",
          maskImage: "radial-gradient(34% 46% at 50% 52%, #000 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(34% 46% at 50% 52%, #000 10%, transparent 75%)",
          mixBlendMode: "screen",
          opacity: 0.1,
        }}
      />
    </div>
  );
}
