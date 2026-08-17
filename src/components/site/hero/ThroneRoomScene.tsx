import { motion, useScroll, useTransform } from "motion/react";
import { useIntro } from "@/components/site/intro-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { FirelightLayer } from "@/components/site/hero/FirelightLayer";
import { EmberLayer } from "@/components/site/hero/EmberLayer";
import { usePointerDepth } from "@/components/site/hero/useDepth";
import throneImage from "@/assets/throne.jpg";

/**
 * ThroneRoomScene — Pure Photographic Medieval Throne Room.
 *
 * Real, atmospheric, and free of artificial milky clouds/white haze:
 * - High-resolution photographic Iron Throne scene
 * - Authentic depth and natural stone shadows
 * - Real brazier firelight flickers and drifting embers
 * - Clean dark vignette framing the composition
 */
export function ThroneRoomScene() {
  const { camera, phase } = useIntro();
  const isMobile = useIsMobile();
  const { px, py } = usePointerDepth();
  const { scrollY } = useScroll();
  const scrollShift = useTransform(scrollY, [0, 900], [0, isMobile ? 50 : 120]);

  // Camera: imperceptible slow push scale 1.00 -> 1.025 with subtle drift
  const camScale = useTransform(camera, [0, 1], [1.0, 1.025]);
  const camX = useTransform(camera, [0, 1], ["0%", "0.25%"]);
  const camY = useTransform(camera, [0, 1], ["0%", "-0.15%"]);

  // Subtle mouse depth offsets
  const mouseX = useTransform(px, (v) => v * 3);
  const mouseY = useTransform(py, (v) => v * 2);

  // Soft room emergence opacity: Shot 01 (0.25) -> Shot 02 (0.75) -> Settled (1.0)
  const roomOpacity = phase === 0 ? 0.25 : phase === 1 ? 0.75 : 1;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-background">
      <motion.div
        className="absolute -inset-4 will-change-transform"
        style={{
          y: scrollShift,
          scale: camScale,
          x: camX,
          opacity: roomOpacity,
          transition: "opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* 1. Real Photographic Throne Artwork Layer (Sharp, natural, dark medieval tones) */}
        <motion.div
          className="absolute -inset-4 will-change-transform"
          style={{ x: mouseX, y: mouseY }}
        >
          <img
            src={throneImage}
            alt=""
            width={1920}
            height={1280}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center"
            style={{
              filter: "brightness(0.62) contrast(1.18) saturate(0.88)",
            }}
          />
        </motion.div>

        {/* 2. Warm Flank Firelight Layer (Natural brazier flickers on sides) */}
        <FirelightLayer />

        {/* 3. Sparse Atmospheric Embers */}
        <EmberLayer />
      </motion.div>

      {/* ── 4. Clean Cinematic Vignettes & Pure Dark Framing ── */}
      {/* Deep Peripheral Vignette (No milky clouds, pure dark falloff) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 6,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 48%, transparent 28%, rgba(5, 5, 7, 0.48) 58%, rgba(3, 3, 5, 0.92) 84%, #030305 100%)",
        }}
      />

      {/* Deep Top Header Shadow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-36"
        style={{
          zIndex: 6,
          background:
            "linear-gradient(to bottom, var(--background) 0%, rgba(4, 4, 6, 0.85) 50%, transparent 100%)",
        }}
      />

      {/* Deep Bottom Foreground Falloff */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
        style={{
          zIndex: 6,
          background:
            "linear-gradient(to top, var(--background) 0%, rgba(4, 4, 6, 0.95) 45%, transparent 100%)",
        }}
      />
    </div>
  );
}
