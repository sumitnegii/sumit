import { useState } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useIntro } from "@/components/site/intro-context";
import { usePointerDepth } from "@/components/site/hero/useDepth";
import { relicButton } from "@/components/site/primitives";
import { profile } from "@/data/portfolio";
import { HangingSigil } from "@/components/site/hero/HangingSigil";
import { ChroniclesCutTransition } from "@/components/site/hero/ChroniclesCutTransition";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * HeroContent — the title sequence and the final resting state.
 *
 * Text is treated as part of the composition: it emerges out of the room's
 * own darkness (a soft blur + a small, weighty drift) rather than sliding in
 * as UI. CTAs and the scroll cue arrive last, once the sequence is complete.
 */
export function HeroContent() {
  const reduced = useReducedMotion();
  const { phase, done } = useIntro();
  const { px, py } = usePointerDepth();
  const [cuttingToChronicles, setCuttingToChronicles] = useState(false);
  const x = useTransform(px, (v) => v * 3.5);
  const y = useTransform(py, (v) => v * 2);

  // Shot 05: Identity hierarchy
  const houseOfCodeIn = phase >= 3;
  const nameIn = phase >= 3;
  const subtitleIn = phase >= 4;
  const quoteIn = phase >= 4;
  const controlsIn = phase >= 5;

  return (
    <motion.div className="relative z-20 mx-auto w-full max-w-3xl" style={{ x, y }}>
      {/* 1. HOUSE OF CODE — small and restrained */}
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 5 }}
        animate={houseOfCodeIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
        transition={{ duration: 0.8, ease }}
        className="eyebrow"
      >
        House of Code
      </motion.p>

      {/* 2. SUMIT SINGH — Hero moment: slow emergence from darkness with one-time gold light catch */}
      <div className="relative mt-6 flex items-center justify-center">
        <motion.h1
          initial={
            reduced
              ? false
              : { opacity: 0, y: 8, filter: "blur(8px) brightness(0.4)" }
          }
          animate={
            nameIn
              ? { opacity: 1, y: 0, filter: "blur(0px) brightness(1)" }
              : { opacity: 0, y: 8, filter: "blur(8px) brightness(0.4)" }
          }
          transition={{ duration: 1.85, delay: 0.25, ease }}
          className={`text-[2.4rem] leading-[0.95] tracking-[0.14em] text-gold-gradient sm:text-5xl md:text-6xl ${
            phase >= 4 && !reduced ? "hero-name-light-catch" : ""
          }`}
        >
          {profile.name.toUpperCase()}
        </motion.h1>
      </div>

      {/* 3. SOFTWARE ENGINEER — Divider rules and role title */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 5 }}
        animate={subtitleIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
        transition={{ duration: 0.85, delay: 0.15, ease }}
        className="mt-6 flex items-center justify-center gap-4"
      >
        <span className="rule-gold block h-px w-16 shrink-0" />
        <p className="font-display text-[0.66rem] tracking-[0.42em] text-steel uppercase sm:text-xs">
          {profile.title}
        </p>
        <span className="rule-gold block h-px w-16 shrink-0" />
      </motion.div>

      {/* 4. Quote — "Every realm has its builders." */}
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={quoteIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.85, delay: 0.4, ease }}
        className="mx-auto mt-8 max-w-md text-base text-muted-foreground italic sm:text-lg"
      >
        &ldquo;{profile.tagline}&rdquo;
      </motion.p>

      {/* 5. Shot 07: Controls Arrive — Enter the Realm / View Chronicles */}
      <div
        className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5"
        style={{ pointerEvents: controlsIn ? "auto" : "none" }}
      >
        <motion.a
          href="#citadel"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={controlsIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.55, ease }}
          className={relicButton({ variant: "forged", size: "lg" })}
        >
          Enter the Realm
        </motion.a>
        <motion.a
          href="#chronicles"
          onClick={(e) => {
            if (!reduced) {
              e.preventDefault();
              setCuttingToChronicles(true);
            }
          }}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={controlsIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
          className={relicButton({ variant: "stone", size: "lg" })}
        >
          View My Chronicles
        </motion.a>
      </div>

      {/* 6. Shot 08: Hanging Sigil — Suspended ancient seal settling into resting position */}
      <HangingSigil visible={done || phase >= 6} />

      {/* 7. View My Chronicles: Cinematic Physical Screen-Cut Transition */}
      <ChroniclesCutTransition
        active={cuttingToChronicles}
        onComplete={() => setCuttingToChronicles(false)}
      />
    </motion.div>
  );
}
