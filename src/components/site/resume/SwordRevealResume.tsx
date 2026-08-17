import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { profile } from "@/data/portfolio";
import { useSound } from "@/components/site/sound-context";
import { ResumeDocument } from "@/components/site/resume/ResumeDocument";
import { relicButton } from "@/components/site/primitives";
import swordImg from "@/assets/sword.png";

/**
 * Royal Records → Resume: Physical Sword-Cut Screen Reveal.
 *
 * Choreography (~3.8s total duration):
 *   0ms → 800ms     Shot 01: Pre-cut scene darkening & atmospheric tension
 *   800ms → 1600ms  Shot 02: Real steel medieval sword enters the viewport
 *   1600ms → 2500ms Shot 03: The blade slices through the screen; two halves physically separate
 *   2500ms → 3200ms Shot 04: The resume underneath is revealed as cut pieces dissolve & sword exits
 *   3200ms → 3800ms Resume settles into place; top controls appear; scene becomes calm
 */

type CutPhase = "idle" | "darken" | "enter" | "cut" | "reveal" | "settled" | "closing";

const EASE_PHYSICAL = [0.25, 1, 0.5, 1] as const;
const EASE_SWORD = [0.2, 0.8, 0.25, 1] as const;

export function SwordRevealResume({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
    if (!open) {
      if (phase !== "idle") setPhase("idle");
      return;
    }
    if (reduced) {
      setPhase("settled");
      return;
    }

    // Phase 1 — Stillness & Anticipation (0 - 500ms)
    setPhase("darken");
    cue("blade-draw");

    // Phase 2 — The Cut Begins (500ms - 1800ms)
    at(500, () => {
      setPhase("enter");
      at(300, () => cue("blade-slash"));
    });

    // Phase 3 — Physical Screen Separation (1800ms - 3000ms)
    at(1800, () => {
      setPhase("cut");
      cue("blade-impact");
    });

    // Phase 4 — Reveal & Settle (3000ms - 3800ms)
    at(3000, () => {
      setPhase("reveal");
    });

    at(3800, () => {
      setPhase("settled");
    });

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduced]);

  // Lock body scroll & handle Escape key
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleClose = useCallback(() => {
    if (reduced) {
      onClose();
      return;
    }
    clearTimers();
    setPhase("closing");
    at(350, onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, reduced]);

  const isCut = phase === "cut" || phase === "reveal" || phase === "settled" || phase === "closing";
  const showResume = phase === "reveal" || phase === "settled" || phase === "closing";
  const showSword = phase === "enter" || phase === "cut" || phase === "reveal";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.35, ease: EASE_PHYSICAL }}
          role="dialog"
          aria-modal="true"
          aria-label="Royal Records Resume"
        >
          {/* ── 1. The Resume Document (Stationary underneath the old record) ── */}
          <motion.div
            className="absolute inset-0 overflow-y-auto overscroll-contain bg-[oklch(0.08_0.005_60)] will-change-transform"
            initial={{ opacity: 0, scale: 0.985, filter: "brightness(0.75)" }}
            animate={
              reduced || showResume
                ? {
                    opacity: 1,
                    scale: phase === "settled" || reduced ? 1 : 0.995,
                    filter: "brightness(1)",
                    y: phase === "settled" || reduced ? 0 : 6,
                  }
                : { opacity: 0, scale: 0.985, filter: "brightness(0.75)", y: 12 }
            }
            transition={{ duration: reduced ? 0.2 : 0.65, ease: EASE_PHYSICAL }}
            style={{
              visibility: reduced || showResume ? "visible" : "hidden",
            }}
          >
            <div className="px-3 py-14 sm:px-8 sm:py-20">
              <ResumeDocument />
            </div>
          </motion.div>

          {/* ── 2. The Physical Two Halves of Royal Records ── */}
          {!reduced && phase !== "settled" && phase !== "closing" ? (
            <>
              <CutHalf side="upper" isCut={isCut} phase={phase} />
              <CutHalf side="lower" isCut={isCut} phase={phase} />
              <CutSeam active={isCut} />
              <AtmosphericCutMotes active={phase === "cut"} />
            </>
          ) : null}

          {/* ── 3. Realistic Medieval Sword Slice ── */}
          {!reduced && showSword ? (
            <RealisticSwordBlade phase={phase} mobile={mobile} />
          ) : null}

          {/* ── 4. Fixed Header Controls ── */}
          <AnimatePresence>
            {phase === "settled" || reduced ? (
              <motion.div
                className="pointer-events-none fixed inset-x-0 top-0 z-[95] flex justify-between gap-3 px-4 py-3 sm:px-8 sm:py-5"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_PHYSICAL }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-sm border border-[color-mix(in_oklab,var(--gold)_32%,transparent)] bg-[oklch(0.09_0.005_60_/_0.88)] px-4 py-2.5 font-display text-[0.62rem] tracking-[0.24em] text-muted-foreground uppercase backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-gold sm:text-[0.68rem]"
                >
                  <ArrowLeft className="h-4 w-4" /> Return to Royal Records
                </button>
                <a
                  href={profile.resumeUrl}
                  download
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-sm border border-[color-mix(in_oklab,var(--gold)_32%,transparent)] bg-[oklch(0.09_0.005_60_/_0.88)] px-4 py-2.5 font-display text-[0.62rem] tracking-[0.24em] text-gold uppercase backdrop-blur-md transition-colors duration-300 hover:border-gold hover:bg-gold/10 sm:text-[0.68rem]"
                >
                  <Download className="h-4 w-4" /> Download Resume
                </a>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Authentic replica of the Royal Records view rendered inside each physical half.
 */
function RoyalRecordsViewMock() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-5 py-24 sm:px-8 md:py-32">
      <div className="panel-parchment relative mx-auto w-full max-w-4xl overflow-hidden rounded-sm px-6 py-12 text-center sm:px-14 sm:py-16 shadow-[var(--shadow-relic)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(120% 90% at 20% 0%, oklch(0 0 0 / 0.05), transparent 60%), radial-gradient(100% 80% at 90% 100%, oklch(0 0 0 / 0.07), transparent 55%)",
          }}
        />
        <div className="relative">
          <p className="font-display text-[0.66rem] tracking-[0.42em] uppercase opacity-70">
            Royal Records
          </p>
          <h2 className="mt-5 text-3xl tracking-[0.12em] sm:text-4xl text-[#2a241b]">
            ROYAL RECORDS
          </h2>
          <div
            className="mx-auto mt-6 h-px w-40"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(0.3 0.06 60), transparent)",
            }}
          />
          <p className="mt-6 text-sm italic opacity-80 sm:text-base text-[#3d3429]">
            The complete record — experience, education, and every system built.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div className={relicButton({ variant: "blood", size: "lg" })}>
              <FileText className="h-4 w-4" /> View Resume
            </div>
            <div className="inline-flex items-center justify-center gap-2 border border-current/40 px-8 py-4 font-display text-xs tracking-[0.28em] uppercase text-[#3d3429]">
              <Download className="h-4 w-4" /> Download Resume
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One physical cut half of the Royal Records screen.
 * Cut line angle: ~13.5deg (from (0%, 42%) to (100%, 58%)).
 */
function CutHalf({
  side,
  isCut,
  phase,
}: {
  side: "upper" | "lower";
  isCut: boolean;
  phase: CutPhase;
}) {
  // Exact polygon cut boundary
  const clip =
    side === "upper"
      ? "polygon(0 0, 100% 0, 100% 58%, 0 42%)"
      : "polygon(0 42%, 100% 58%, 100% 100%, 0 100%)";

  // Physical separation translation
  const dx = side === "upper" ? -28 : 28;
  const dy = side === "upper" ? -22 : 24;
  const rot = side === "upper" ? -0.5 : 0.5;

  // Shot 01 brightness reduction & Shot 04 dissolve
  const brightness =
    phase === "darken"
      ? "brightness(0.72) saturate(0.85)"
      : phase === "enter"
        ? "brightness(0.7) saturate(0.82)"
        : "brightness(0.68) saturate(0.8)";

  const opacity = phase === "reveal" ? 0 : 1;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[92] overflow-hidden will-change-transform"
      style={{
        clipPath: clip,
        WebkitClipPath: clip,
        filter: brightness,
        transition: "filter 700ms ease-out",
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      animate={{
        x: isCut ? dx : 0,
        y: isCut ? dy : 0,
        rotate: isCut ? rot : 0,
        opacity,
        scale: isCut ? 1.012 : 1,
      }}
      transition={{
        x: { duration: 0.75, ease: EASE_PHYSICAL },
        y: { duration: 0.75, ease: EASE_PHYSICAL },
        rotate: { duration: 0.75, ease: EASE_PHYSICAL },
        scale: { duration: 0.75, ease: EASE_PHYSICAL },
        opacity: { duration: 0.45, ease: "easeOut", delay: phase === "reveal" ? 0 : 0 },
      }}
    >
      <RoyalRecordsViewMock />

      {/* Subtle physical cut shadow on the sheared edge */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            side === "upper"
              ? "linear-gradient(166deg, transparent 40%, rgba(0,0,0,0.55) 58%, transparent 60%)"
              : "linear-gradient(-14deg, transparent 40%, rgba(0,0,0,0.55) 58%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

/**
 * Cut line seam where the blade sliced through.
 */
function CutSeam({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[93] overflow-hidden"
    >
      {/* Fine dark cut slit */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full opacity-80"
      >
        <line
          x1="0"
          y1="42"
          x2="100"
          y2="58"
          stroke="rgba(10, 8, 6, 0.85)"
          strokeWidth="0.35"
        />
      </svg>
    </div>
  );
}

/**
 * 8-12 tiny atmospheric paper/dust motes drifting gently away along the cut line.
 */
function AtmosphericCutMotes({ active }: { active: boolean }) {
  if (!active) return null;
  const motes = [
    { x: "22%", y: "44%", dx: -12, dy: -18 },
    { x: "34%", y: "46%", dx: 10, dy: 16 },
    { x: "45%", y: "48%", dx: -8, dy: -14 },
    { x: "52%", y: "50%", dx: 14, dy: 12 },
    { x: "63%", y: "52%", dx: -15, dy: 15 },
    { x: "74%", y: "54%", dx: 8, dy: -16 },
    { x: "85%", y: "56%", dx: 12, dy: 10 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[93] overflow-hidden"
    >
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-[#f0d8a8]"
          style={{ left: m.x, top: m.y, filter: "blur(0.4px)" }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.75, 0],
            x: m.dx * 1.5,
            y: m.dy * 1.5,
            scale: 1,
          }}
          transition={{ duration: 0.85, ease: "easeOut", delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

/**
 * Realistic Medieval Longsword Blade.
 * Enters at a controlled cutting angle (~13.5deg), sweeps through with physical momentum, catches light, and exits.
 */
function RealisticSwordBlade({
  phase,
  mobile,
}: {
  phase: CutPhase;
  mobile: boolean;
}) {
  const width = mobile ? 480 : 860;

  // Keyframes for the deliberate, heavy sword stroke:
  // Enter (800..1600ms) -> Cut (1600..2500ms) -> Exit (2500..3200ms)
  const xPos =
    phase === "enter"
      ? "-30vw"
      : phase === "cut"
        ? "45vw"
        : "135vw";

  const yPos =
    phase === "enter"
      ? "-4vh"
      : phase === "cut"
        ? "6vh"
        : "18vh";

  const duration = phase === "enter" ? 0.8 : phase === "cut" ? 0.9 : 0.7;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[94] overflow-hidden"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 will-change-transform"
        style={{
          rotate: 13.5,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="relative will-change-transform"
          initial={{ x: "-120vw", y: "-18vh", opacity: 0 }}
          animate={{
            x: xPos,
            y: yPos,
            opacity: phase === "reveal" ? [1, 0.6, 0] : 1,
          }}
          transition={{
            duration,
            ease: EASE_SWORD,
            opacity: { duration: 0.5, ease: "easeOut" },
          }}
        >
          {/* Authentic Real Steel Longsword Asset */}
          <div className="relative">
            <img
              src={swordImg}
              alt=""
              width={1920}
              height={640}
              style={{
                width,
                height: "auto",
                filter:
                  "contrast(1.2) brightness(1.25) drop-shadow(0 8px 24px rgba(0,0,0,0.85)) drop-shadow(0 0 12px rgba(226,182,104,0.3))",
              }}
            />

            {/* Steel Light Catch Reflection (Candlelight Gleam on Blade) */}
            {phase === "cut" && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255, 235, 190, 0.45) 50%, rgba(255, 255, 255, 0.6) 52%, transparent 62%)",
                  mixBlendMode: "overlay",
                }}
                initial={{ opacity: 0, x: "-40%" }}
                animate={{ opacity: [0, 0.9, 0], x: "50%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
