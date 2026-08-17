import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIntro } from "@/components/site/intro-context";

/**
 * DragonHeroLayer — a fully isolated, full-screen compositing slot for the
 * REAL photorealistic dragon video (Veo). Nothing else in the hero depends on
 * it, and it renders no fake dragon.
 *
 * Supports: transparent (webm/alpha) or regular video compositing, poster
 * frame, opacity / position / scale / z-index control, a cinematic entrance
 * and exit, lazy loading (the file is only requested on cue) and a lighter
 * mobile source.
 *
 * ADDING THE FOOTAGE LATER
 *   <DragonHeroLayer
 *     src="/video/dragon.webm"            // alpha webm preferred
 *     fallbackSrc="/video/dragon.mp4"     // opaque mp4, composited with screen
 *     mobileSrc="/video/dragon-mobile.webm"
 *     poster="/video/dragon-poster.jpg"
 *   />
 *
 * The layer sits BELOW the hero title (z-index 5 vs. content z-20) and its
 * flight band is constrained to the upper third, so the dragon can never
 * cover the name, the role or the CTAs.
 */
export function DragonHeroLayer({
  src,
  fallbackSrc,
  mobileSrc,
  poster,
  /** transparent-video sources composite normally; opaque ones use screen */
  transparent = true,
  opacity = 0.9,
  scale = 1,
  /** vertical placement of the flight band, % from the top */
  top = "6%",
  height = "42%",
  zIndex = 5,
}: {
  src?: string;
  fallbackSrc?: string;
  mobileSrc?: string;
  poster?: string;
  transparent?: boolean;
  opacity?: number;
  scale?: number;
  top?: string;
  height?: string;
  zIndex?: number;
}) {
  const { phase } = useIntro();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // phase 3 is the dragon beat; phase 4 is the room settling after it.
  const active = phase === 3;
  const passed = phase >= 4;

  useEffect(() => {
    if (active) setMounted(true);
  }, [active]);

  useEffect(() => {
    if (mounted && videoRef.current) void videoRef.current.play().catch(() => {});
  }, [mounted]);

  const source = (isMobile && mobileSrc) || src || fallbackSrc;

  if (!source) return null;

  return (
    <div
      aria-hidden
      data-dragon-layer
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex }}
    >
      {/* Flight band — never overlaps the title block below it */}
      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{ top, height }}
        initial={false}
        animate={{
          opacity: reduced ? 0 : active ? opacity : 0,
          scale: active ? scale : scale * 0.98,
        }}
        transition={{ duration: active ? 1.6 : 2.4, ease: [0.33, 0, 0.2, 1] }}
      >
        {mounted && source ? (
          <video
            ref={videoRef}
            poster={poster}
            muted
            playsInline
            preload="none"
            className="h-full w-full object-cover"
            style={transparent ? undefined : { mixBlendMode: "screen" }}
          >
            <source src={source} type={source.endsWith(".webm") ? "video/webm" : "video/mp4"} />
            {fallbackSrc && fallbackSrc !== source ? (
              <source src={fallbackSrc} type="video/mp4" />
            ) : null}
          </video>
        ) : null}
      </motion.div>

      {/* PHASE 10 — the room reacts: a slow shadow sweep and a pressure wave
          through the smoke. Subtle, no flash, no shake. Kept even without
          footage so the timing can be tuned in advance. */}
      {!reduced && (active || passed) ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, transparent 30%, oklch(0 0 0 / 0.34) 48%, transparent 66%)",
            animation: "dragon-shadow 5.2s cubic-bezier(0.4, 0, 0.35, 1) forwards",
          }}
        />
      ) : null}
      {!reduced && (active || passed) ? (
        <div
          className="absolute inset-x-0 top-0 h-2/3"
          style={{
            background:
              "radial-gradient(46% 40% at 50% 45%, color-mix(in oklab, var(--steel) 9%, transparent), transparent 72%)",
            filter: "blur(30px)",
            animation: "dragon-wake 6s cubic-bezier(0.4, 0, 0.5, 1) forwards",
          }}
        />
      ) : null}
    </div>
  );
}
