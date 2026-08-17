import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Atmospheric layer: drifting fog + rising embers.
 * Pure CSS — cheap enough to keep running behind the whole page.
 */
export function ParticleBackground({
  density = 26,
  className,
}: {
  density?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const embers = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        size: 1 + ((i * 13) % 3),
        delay: (i * 1.7) % 22,
        duration: 16 + ((i * 5) % 18),
        drift: ((i % 7) - 3) * 22,
        opacity: 0.25 + ((i % 5) * 0.12),
      })),
    [density],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="animate-fog absolute -inset-x-1/4 top-0 h-2/3 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 40%, color-mix(in oklab, var(--steel) 9%, transparent), transparent 70%), radial-gradient(50% 40% at 75% 30%, color-mix(in oklab, var(--steel) 7%, transparent), transparent 70%)",
        }}
      />
      <div
        className="animate-flicker absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "var(--gradient-fire)" }}
      />
      {!reduced &&
        embers.map((e) => (
          <span
            key={e.id}
            className="absolute bottom-[-10px] rounded-full"
            style={{
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              opacity: e.opacity,
              background: "var(--ember)",
              boxShadow: "0 0 8px 1px color-mix(in oklab, var(--ember) 60%, transparent)",
              // @ts-expect-error custom property
              "--drift": `${e.drift}px`,
              animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
            }}
          />
        ))}
    </div>
  );
}
