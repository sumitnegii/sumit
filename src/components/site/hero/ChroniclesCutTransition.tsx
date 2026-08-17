import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSound } from "@/components/site/sound-context";
import { profile } from "@/data/portfolio";
import swordImg from "@/assets/sword.png";
import throneImage from "@/assets/throne.jpg";

/**
 * ChroniclesCutTransition — Cinematic Screen-Cut Reveal from Hero to The Chronicles.
 *
 * Sequence (~3.8s total duration):
 *   Phase 1 (0–500ms): Stillness & anticipation. Room stays visible.
 *   Phase 2 (500ms–1800ms): Massive diagonal blade-like cut moves across the viewport.
 *   Phase 3 (1800ms–3000ms): Physical separation of the screen halves, revealing The Chronicles underneath.
 *   Phase 4 (3000ms–3800ms): Destination settles, overlay dissolves, scrolling restores.
 */

type CutPhase = "idle" | "stillness" | "cutting" | "separating" | "revealing" | "complete";

const EASE_PHYSICAL = [0.25, 1, 0.5, 1] as const;
const EASE_SWORD = [0.2, 0.8, 0.25, 1] as const;

export function ChroniclesCutTransition({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete: () => void;
}) {
  const reduced = useReducedMotion();
  const { cue } = useSound();
  const [phase, setPhase] = useState<CutPhase>("idle");
  const timers = useRef<number[]>([]);
  const mobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const at = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    clearTimers();
    if (!active) {
      setPhase("idle");
      return;
    }

    if (reduced) {
      const el = document.getElementById("chronicles");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      onComplete();
      return;
    }

    // Phase 1 — Stillness (0–500ms)
    setPhase("stillness");
    cue("blade-draw");

    // Phase 2 — The Cut Begins (500ms–1800ms)
    at(500, () => {
      setPhase("cutting");
      cue("blade-slash");
    });

    // Phase 3 — Physical Screen Separation (1800ms–3000ms)
    at(1800, () => {
      setPhase("separating");
      cue("blade-impact");
    });

    // Phase 4 — Reveal & Scroll (3000ms–3800ms)
    at(3000, () => {
      setPhase("revealing");
      const el = document.getElementById("chronicles");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });

    at(3800, () => {
      setPhase("complete");
      onComplete();
    });

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced]);

  if (!active || phase === "idle" || phase === "complete") return null;

  const isCut = phase === "separating" || phase === "revealing";
  const showSword = phase === "cutting" || phase === "separating";

  return (
    <div
      role="dialog"
      aria-label="Cinematic transition to The Chronicles"
      className="fixed inset-0 z-[88] overflow-hidden bg-background pointer-events-none"
    >
      {/* ── 1. Destination Section Preview (Stationary Underneath) ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[oklch(0.08_0.005_60)] px-6 text-center"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{
          opacity: isCut ? 1 : 0,
          scale: phase === "revealing" ? 1 : 0.992,
        }}
        transition={{ duration: 0.8, ease: EASE_PHYSICAL }}
      >
        <p className="font-display text-[0.68rem] tracking-[0.42em] text-gold uppercase opacity-80">
          The Kingdom
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-[0.16em] text-gold-gradient uppercase sm:text-4xl">
          THE CHRONICLES
        </h2>
        <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <p className="mt-4 text-sm text-muted-foreground italic">
          A record of service, kept in order.
        </p>
      </motion.div>

      {/* ── 2. The Two Physical Cut Halves of the Hero View ── */}
      <HeroCutHalf side="upper" isCut={isCut} phase={phase} />
      <HeroCutHalf side="lower" isCut={isCut} phase={phase} />

      {/* ── 3. Hairline Dark Cut Seam ── */}
      {isCut && (
        <div className="absolute inset-0 z-[91] pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full opacity-80">
            <line x1="0" y1="40" x2="100" y2="60" stroke="rgba(15, 12, 10, 0.9)" strokeWidth="0.35" />
          </svg>
        </div>
      )}

      {/* ── 4. Massive Realistic Sword Blade Slice ── */}
      {showSword && (
        <div className="absolute inset-0 z-[93] pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 will-change-transform"
            style={{ rotate: 11.5, translateX: "-50%", translateY: "-50%" }}
          >
            <motion.div
              className="relative will-change-transform"
              initial={{ x: "-120vw", y: "-15vh", opacity: 0 }}
              animate={{
                x: phase === "cutting" ? "30vw" : "135vw",
                y: phase === "cutting" ? "5vh" : "18vh",
                opacity: phase === "separating" ? [1, 0.7, 0] : 1,
              }}
              transition={{
                duration: phase === "cutting" ? 1.3 : 0.9,
                ease: EASE_SWORD,
                opacity: { duration: 0.6, ease: "easeOut" },
              }}
            >
              <img
                src={swordImg}
                alt=""
                width={1920}
                height={640}
                style={{
                  width: mobile ? 480 : 920,
                  height: "auto",
                  filter:
                    "contrast(1.22) brightness(1.28) drop-shadow(0 8px 24px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(226,182,104,0.35))",
                }}
              />
              {phase === "cutting" && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255, 235, 190, 0.5) 50%, rgba(255, 255, 255, 0.7) 52%, transparent 62%)",
                    mixBlendMode: "overlay",
                  }}
                  initial={{ opacity: 0, x: "-40%" }}
                  animate={{ opacity: [0, 0.9, 0], x: "50%" }}
                  transition={{ duration: 1.0, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function HeroViewReplica() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-5 pt-24 pb-20 text-center">
      {/* Background Throne Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={throneImage}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-center"
          style={{ filter: "brightness(0.44) contrast(1.28) saturate(0.82)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 82% 72% at 50% 48%, transparent 18%, rgba(6, 6, 8, 0.58) 55%, rgba(4, 4, 6, 0.92) 84%, #040406 100%)",
          }}
        />
      </div>

      {/* Hero Content Mock */}
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <p className="eyebrow">House of Code</p>
        <h1 className="mt-6 text-[2.4rem] leading-[0.95] tracking-[0.14em] text-gold-gradient sm:text-5xl md:text-6xl">
          {profile.name.toUpperCase()}
        </h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="rule-gold block h-px w-16 shrink-0" />
          <p className="font-display text-[0.66rem] tracking-[0.42em] text-steel uppercase sm:text-xs">
            {profile.title}
          </p>
          <span className="rule-gold block h-px w-16 shrink-0" />
        </div>
        <p className="mx-auto mt-8 max-w-md text-base text-muted-foreground italic sm:text-lg">
          &ldquo;{profile.tagline}&rdquo;
        </p>
      </div>
    </div>
  );
}

function HeroCutHalf({
  side,
  isCut,
  phase,
}: {
  side: "upper" | "lower";
  isCut: boolean;
  phase: CutPhase;
}) {
  const clip =
    side === "upper"
      ? "polygon(0 0, 100% 0, 100% 60%, 0 40%)"
      : "polygon(0 40%, 100% 60%, 100% 100%, 0 100%)";

  const dx = side === "upper" ? -28 : 28;
  const dy = side === "upper" ? -20 : 22;
  const rot = side === "upper" ? -0.4 : 0.4;

  const opacity = phase === "revealing" ? 0 : 1;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[90] overflow-hidden will-change-transform"
      style={{
        clipPath: clip,
        WebkitClipPath: clip,
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      animate={{
        x: isCut ? dx : 0,
        y: isCut ? dy : 0,
        rotate: isCut ? rot : 0,
        opacity,
        scale: isCut ? 1.01 : 1,
      }}
      transition={{
        x: { duration: 0.8, ease: EASE_PHYSICAL },
        y: { duration: 0.8, ease: EASE_PHYSICAL },
        rotate: { duration: 0.8, ease: EASE_PHYSICAL },
        scale: { duration: 0.8, ease: EASE_PHYSICAL },
        opacity: { duration: 0.45, ease: "easeOut" },
      }}
    >
      <HeroViewReplica />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            side === "upper"
              ? "linear-gradient(168deg, transparent 42%, rgba(0,0,0,0.6) 60%, transparent 62%)"
              : "linear-gradient(-12deg, transparent 42%, rgba(0,0,0,0.6) 60%, transparent 62%)",
        }}
      />
    </motion.div>
  );
}
