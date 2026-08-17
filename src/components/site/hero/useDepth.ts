import { useEffect } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { MotionValue } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIntro } from "@/components/site/intro-context";

/**
 * Extremely subtle pointer depth response, in pixels at depth factor 1.
 * Only active once the cinematic intro has finished — the camera owns the
 * frame until then.
 */
export function usePointerDepth(): { px: MotionValue<number>; py: MotionValue<number> } {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { done } = useIntro();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 18, damping: 22, mass: 1.4 });
  const py = useSpring(rawY, { stiffness: 18, damping: 22, mass: 1.4 });

  useEffect(() => {
    if (reduced || isMobile || !done) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, isMobile, done, rawX, rawY]);

  return { px, py };
}
