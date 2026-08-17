import { motion, useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIntro } from "@/components/site/intro-context";

/**
 * SmokeLayer — dark, translucent smoke inside a huge stone room.
 *
 * Several very low-contrast planes drift at different speeds and depths.
 * Distant planes sit behind the throne (atmospheric perspective), near planes
 * pass in front of the camera. Never a white fog filter.
 */
const PLANES = [
  {
    depth: "far" as const,
    opacity: 0.3,
    blur: 26,
    duration: 96,
    y: "0%",
    height: "70%",
    tint: "var(--steel)",
    strength: 9,
  },
  {
    depth: "mid" as const,
    opacity: 0.26,
    blur: 34,
    duration: 74,
    y: "22%",
    height: "78%",
    tint: "var(--ember)",
    strength: 7,
  },
  {
    depth: "near" as const,
    opacity: 0.22,
    blur: 44,
    duration: 58,
    y: "42%",
    height: "70%",
    tint: "var(--stone, var(--steel))",
    strength: 12,
  },
];

export function SmokeLayer({ camera }: { camera: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { phase } = useIntro();
  const planes = isMobile ? PLANES.slice(0, 2) : PLANES;

  // Near smoke slides past the lens as the camera moves in.
  const nearScale = useTransform(camera, [0, 1], [1, 1.5]);
  const farScale = useTransform(camera, [0, 1], [1, 1.08]);

  const visible = phase === 0 ? 0.35 : 1;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {planes.map((p, i) => (
        <motion.div
          key={p.depth}
          className="absolute -inset-x-1/3 overflow-visible will-change-transform"
          style={{
            top: p.y,
            height: p.height,
            zIndex: p.depth === "near" ? 4 : p.depth === "mid" ? 2 : 0,
            scale: p.depth === "near" ? nearScale : farScale,
            opacity: p.opacity * visible,
            transition: "opacity 3s ease-out",
            mixBlendMode: "screen",
          }}
        >
          {/* the CSS drift owns `transform`, so it lives on its own element */}
          <div
            className="h-full w-full will-change-transform"
            style={{
              filter: `blur(${p.blur}px)`,
              background: `radial-gradient(48% 42% at 28% 60%, color-mix(in oklab, ${p.tint} ${p.strength}%, transparent), transparent 70%),
                         radial-gradient(42% 38% at 72% 45%, color-mix(in oklab, ${p.tint} ${Math.round(p.strength * 0.7)}%, transparent), transparent 72%),
                         radial-gradient(60% 30% at 50% 88%, color-mix(in oklab, ${p.tint} ${Math.round(p.strength * 0.9)}%, transparent), transparent 76%)`,
              animation: reduced
                ? undefined
                : `smoke-drift-${i % 2 === 0 ? "a" : "b"} ${p.duration}s ease-in-out infinite`,
            }}
          />
        </motion.div>
      ))}

      {/* Deep haze that eats contrast in the distance — atmospheric perspective */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, transparent 40%, color-mix(in oklab, var(--steel) 6%, transparent))",
        }}
      />
    </div>
  );
}
