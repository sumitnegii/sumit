import { motion } from "motion/react";
import { useIntro } from "@/components/site/intro-context";

/**
 * CinematicIntro — the film grammar that sits over the scene: the opening
 * blackout, the soft anamorphic edge, a whisper of grain, and a discreet
 * escape hatch. It owns no environment of its own.
 */
export function CinematicIntro() {
  const { phase, playing, skip } = useIntro();

  // Shot 01 (0..600ms): Blackout 0.98 -> Shot 02 (600..1400ms): 0.55 -> Shot 03 (1400..2200ms): 0.12 -> 0
  const blackout = phase === 0 ? 0.98 : phase === 1 ? 0.55 : phase === 2 ? 0.12 : 0;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-background"
        initial={false}
        animate={{ opacity: blackout }}
        transition={{ duration: 1.6, ease: [0.33, 0, 0.2, 1] }}
      />

      {/* The faintest warm breath in the dark of Shot 01 */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        initial={false}
        animate={{ opacity: phase <= 1 ? 0.45 : 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(40% 30% at 50% 72%, color-mix(in oklab, var(--ember) 8%, transparent), transparent 70%)",
        }}
      />

      {/* Lens edge — vignette and a trace of grain, always present */}
      <div
        aria-hidden
        className="grain-overlay pointer-events-none absolute inset-0 z-20 opacity-[0.35]"
      />

      {playing ? (
        <button
          type="button"
          onClick={skip}
          className="absolute right-5 bottom-6 z-40 font-display text-[0.58rem] tracking-[0.3em] text-muted-foreground/70 uppercase transition-colors duration-500 hover:text-gold"
        >
          Skip
        </button>
      ) : null}
    </>
  );
}
