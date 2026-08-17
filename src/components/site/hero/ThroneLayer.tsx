import { motion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import throneImage from "@/assets/throne.jpg";

/**
 * ThroneLayer — one depth plane of the throne room.
 *
 * The room artwork is composited three times (far architecture, throne
 * midground, foreground silhouettes). Each plane reads the shared camera
 * value and travels at its own speed, so the push-in reads as real depth
 * rather than a flat image being scaled.
 *
 * FUTURE 3D SWAP: replace the <img> with a rendered plane / R3F canvas —
 * the transform contract (camera + pointer + depth) stays identical.
 */
export type ThronePlane = "background" | "midground" | "foreground";

const PLANES: Record<
  ThronePlane,
  {
    /** scale at camera 0 → camera 1 */
    scale: [number, number];
    /** vertical travel in % of the frame */
    y: [number, number];
    blur: number;
    /** pointer depth in px */
    depth: number;
    z: number;
  }
> = {
  background: { scale: [1.1, 1.0], y: [1.5, 0], blur: 3.5, depth: 1.5, z: 0 },
  midground: { scale: [1.22, 1.08], y: [3, 0], blur: 0, depth: 3, z: 1 },
  foreground: { scale: [1.9, 1.46], y: [7, 2], blur: 9, depth: 5.5, z: 2 },
};

export function ThroneLayer({
  plane,
  camera,
  px,
  py,
  className,
  children,
}: {
  plane: ThronePlane;
  camera: MotionValue<number>;
  px: MotionValue<number>;
  py: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
}) {
  const cfg = PLANES[plane];
  const scale = useTransform(camera, [0, 1], cfg.scale);
  const yPct = useTransform(camera, [0, 1], cfg.y);
  const y = useTransform(yPct, (v) => `${v}%`);
  const x = useTransform(px, (v) => v * cfg.depth * 2);
  const yOffset = useTransform(py, (v) => v * cfg.depth);

  return (
    <motion.div
      aria-hidden
      className={`absolute inset-0 overflow-hidden will-change-transform ${className ?? ""}`}
      style={{ x, scale, y, zIndex: cfg.z }}
    >
      <motion.div className="absolute -inset-6" style={{ y: yOffset }}>
        <img
          src={throneImage}
          alt=""
          width={1920}
          height={1280}
          fetchPriority={plane === "midground" ? "high" : "low"}
          decoding="async"
          className="h-[112%] w-[112%] -translate-x-[6%] -translate-y-[6%] object-cover object-center"
          style={cfg.blur ? { filter: `blur(${cfg.blur}px)` } : undefined}
        />
        {children}
      </motion.div>
    </motion.div>
  );
}
