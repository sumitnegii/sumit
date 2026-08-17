import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Sparkles } from "lucide-react";
import eggImg from "@/assets/dragon-egg.png";
import shard1 from "@/assets/dragon-egg-shard-1.png";
import shard2 from "@/assets/dragon-egg-shard-2.png";
import shard3 from "@/assets/dragon-egg-shard-3.png";
import shard4 from "@/assets/dragon-egg-shard-4.png";
import coreImg from "@/assets/dragon-egg-core.png";

export type DragonEggProps = {
  id: "egg-realm" | "egg-citadel" | "egg-chronicles";
  relicNumber: "I" | "II" | "III";
  title: string;
  subtitle: string;
  detail: string;
  className?: string;
  popupPlacement?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
};

type HatchState = "idle" | "cracking" | "fragmenting" | "revealed";

/**
 * DragonEgg — A realistic, physical obsidian dragon egg hidden in the environment.
 * Features:
 * - Natural stone texture, surface imperfections & scale roughness
 * - Realistic contact shadow and atmospheric integration
 * - Subtle warm amber glow breathing through hairline cracks on hover
 * - Realistic shell fragmentation physics on click / discovery
 * - Discovered ancient record panel revealing verified portfolio achievements
 * - Session persistence: stays discovered once cracked
 */
export function DragonEgg({
  id,
  relicNumber,
  title,
  subtitle,
  detail,
  className = "",
  popupPlacement = "top-right",
}: DragonEggProps) {
  const reduced = useReducedMotion();
  const [discovered, setDiscovered] = useState(false);
  const [hatchState, setHatchState] = useState<HatchState>("idle");
  const [showPanel, setShowPanel] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize from sessionStorage to maintain persistence across navigation
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = window.sessionStorage.getItem(`dragon_relic_${id}`) === "1";
        if (stored) {
          setDiscovered(true);
          setHatchState("revealed");
        }
      }
    } catch {
      /* ignore */
    }
  }, [id]);

  // Handle outside clicks to close the record popup
  useEffect(() => {
    if (!showPanel) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [showPanel]);

  const handleEggClick = useCallback(() => {
    if (discovered || hatchState === "revealed") {
      setShowPanel((v) => !v);
      return;
    }

    if (reduced) {
      setDiscovered(true);
      setHatchState("revealed");
      setShowPanel(true);
      try {
        window.sessionStorage.setItem(`dragon_relic_${id}`, "1");
      } catch {
        /* ignore */
      }
      return;
    }

    // Physical hatching timeline:
    // 0ms: Cracking begins, inner light intensifies
    setHatchState("cracking");

    // 250ms: Shell fractures into physical shards
    setTimeout(() => {
      setHatchState("fragmenting");
    }, 250);

    // 700ms: Reveal discovered record
    setTimeout(() => {
      setDiscovered(true);
      setHatchState("revealed");
      setShowPanel(true);
      try {
        window.sessionStorage.setItem(`dragon_relic_${id}`, "1");
      } catch {
        /* ignore */
      }
    }, 700);
  }, [discovered, hatchState, id, reduced]);

  // Position popup according to placement prop
  const getPopupStyles = () => {
    switch (popupPlacement) {
      case "top-left":
        return "bottom-full right-0 mb-3";
      case "top-right":
        return "bottom-full left-0 mb-3";
      case "bottom-left":
        return "top-full right-0 mt-3";
      case "bottom-right":
        return "top-full left-0 mt-3";
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-3";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Accessible Trigger Button ── */}
      <button
        type="button"
        onClick={handleEggClick}
        aria-label={`Hidden discovery: Dragon Relic ${relicNumber}`}
        aria-expanded={showPanel}
        className="group relative flex cursor-pointer items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
      >
        {/* Realistic Physical Contact Shadow on Environment */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "82%",
            height: "10px",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 45%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />

        {/* ── 1. INTACT EGG (Idle & Hover State) ── */}
        {(hatchState === "idle" || hatchState === "cracking") && (
          <motion.div
            className="relative will-change-transform"
            animate={{
              scale: isHovered && hatchState === "idle" ? 1.03 : 1,
              y: isHovered && hatchState === "idle" ? -1 : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Real Obsidian Dragon Egg Texture */}
            <img
              src={eggImg}
              alt=""
              width={400}
              height={508}
              loading="lazy"
              className="h-[42px] w-auto object-contain sm:h-[48px] md:h-[52px]"
              style={{
                filter:
                  isHovered || hatchState === "cracking"
                    ? "brightness(1.08) contrast(1.12) drop-shadow(0 0 10px rgba(226, 175, 75, 0.45))"
                    : "brightness(0.72) contrast(1.1) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.8))",
                transition: "filter 350ms ease-out",
              }}
            />

            {/* Faint internal warmth breathing through existing hairline fissure cracks */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at 52% 58%, rgba(255, 185, 80, 0.45) 0%, rgba(226, 120, 30, 0.15) 35%, transparent 65%)",
                opacity: isHovered || hatchState === "cracking" ? 0.85 : 0.15,
                mixBlendMode: "screen",
                transition: "opacity 400ms ease-out",
              }}
            />
          </motion.div>
        )}

        {/* ── 2. HATCHING SEQUENCE (Physical Shell Fragmentation) ── */}
        {hatchState === "fragmenting" && (
          <div className="relative h-[42px] w-[34px] sm:h-[48px] sm:w-[38px] md:h-[52px] md:w-[41px]">
            {/* Glowing Internal Amber Core */}
            <motion.img
              src={coreImg}
              alt=""
              initial={{ scale: 0.6, opacity: 0.2 }}
              animate={{ scale: 1.1, opacity: 0.95 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-contain"
              style={{ mixBlendMode: "screen", filter: "blur(1px)" }}
            />

            {/* Shard 1: Top-Left */}
            <motion.img
              src={shard1}
              alt=""
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: -14, y: -10, rotate: -22, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-contain"
            />

            {/* Shard 2: Top-Right */}
            <motion.img
              src={shard2}
              alt=""
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: 16, y: -8, rotate: 24, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-contain"
            />

            {/* Shard 3: Bottom-Left */}
            <motion.img
              src={shard3}
              alt=""
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: -16, y: 12, rotate: -14, opacity: 0.65 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-contain"
            />

            {/* Shard 4: Bottom-Right */}
            <motion.img
              src={shard4}
              alt=""
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: 16, y: 14, rotate: 16, opacity: 0.65 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        )}

        {/* ── 3. HATCHED STATE (Broken Obsidian Shell & Calmed Amber Core) ── */}
        {hatchState === "revealed" && (
          <div className="relative h-[42px] w-[34px] sm:h-[48px] sm:w-[38px] md:h-[52px] md:w-[41px]">
            {/* Resting Core Ember */}
            <img
              src={coreImg}
              alt=""
              className="absolute inset-0 h-full w-full object-contain opacity-70"
              style={{
                mixBlendMode: "screen",
                filter: "drop-shadow(0 0 6px rgba(255, 185, 80, 0.7))",
              }}
            />

            {/* Broken Bottom Shards Resting on Stone */}
            <img
              src={shard3}
              alt=""
              className="absolute inset-0 h-full w-full -translate-x-2 translate-y-1.5 -rotate-12 object-contain"
              style={{ filter: "brightness(0.75) contrast(1.1) drop-shadow(0 3px 6px rgba(0,0,0,0.8))" }}
            />
            <img
              src={shard4}
              alt=""
              className="absolute inset-0 h-full w-full translate-x-2 translate-y-2 rotate-12 object-contain"
              style={{ filter: "brightness(0.75) contrast(1.1) drop-shadow(0 3px 6px rgba(0,0,0,0.8))" }}
            />
          </div>
        )}
      </button>

      {/* ── Discovered Ancient Record Popup Panel ── */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            role="region"
            aria-label={`Discovered Record: ${title}`}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 w-72 sm:w-80 rounded-sm border border-[color-mix(in_oklab,var(--gold)_38%,transparent)] bg-[oklch(0.12_0.01_60_/_0.95)] p-4 text-left shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9),0_0_24px_-6px_rgba(226,182,104,0.25)] backdrop-blur-md ${getPopupStyles()}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[color-mix(in_oklab,var(--gold)_20%,transparent)] pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span className="font-display text-[0.62rem] tracking-[0.32em] text-gold uppercase">
                  Dragon Relic {relicNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPanel(false)}
                className="cursor-pointer text-muted-foreground transition-colors hover:text-gold"
                aria-label="Close discovery"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-2.5">
              <h4 className="font-display text-xs tracking-wider text-gold-gradient uppercase sm:text-[0.8rem]">
                {title}
              </h4>
              <p className="mt-0.5 font-mono text-[0.6rem] tracking-wider text-muted-foreground uppercase">
                {subtitle}
              </p>
              <div
                className="my-2 h-px w-full"
                style={{
                  background:
                    "linear-gradient(to right, transparent, color-mix(in oklab, var(--gold) 40%, transparent), transparent)",
                }}
              />
              <p className="text-[0.76rem] leading-relaxed text-parchment/90 sm:text-[0.82rem]">
                {detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
