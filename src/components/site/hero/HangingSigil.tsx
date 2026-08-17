import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * HangingSigil — An ancient suspended seal hanging from a slender chain at the bottom of the Hero.
 *
 * Micro-detail:
 * - Swaying naturally in a gentle breeze with pendulum physics from the top anchor mount
 * - Subtle secondary inertia between the chain and the seal
 * - Fades away smoothly as the visitor scrolls down into the Realm
 * - Accessible scroll trigger linking to the realm map / citadel
 */
export function HangingSigil({ visible }: { visible: boolean }) {
  const reduced = useReducedMotion();
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      // Fades out over 0 -> 160px of scroll
      const op = Math.max(0, 1 - y / 160);
      setScrollOpacity(op);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#map") || document.querySelector("#citadel");
    if (target) {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  const totalOpacity = visible ? scrollOpacity : 0;

  return (
    <div
      className="absolute -bottom-24 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ease-out"
      style={{
        opacity: totalOpacity,
        pointerEvents: totalOpacity > 0.1 ? "auto" : "none",
      }}
    >
      <a
        href="#map"
        onClick={handleClick}
        aria-label="Scroll to The Realm"
        className="group relative flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
      >
        <div
          className={`sigil-sway-assembly ${reduced ? "" : "animate-sigil-sway"}`}
          style={{ transformOrigin: "50% 0%" }}
        >
          <svg
            width="32"
            height="62"
            viewBox="0 0 32 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible text-gold-dim transition-all duration-300 ease-out group-hover:text-gold group-hover:drop-shadow-[0_0_8px_rgba(226,182,104,0.35)]"
          >
            {/* Top Anchor Mount */}
            <circle cx="16" cy="3" r="2.2" stroke="currentColor" strokeWidth="1" opacity="0.65" />
            <circle cx="16" cy="3" r="1" fill="currentColor" opacity="0.75" />

            {/* Slender Vertical Suspension Chain */}
            <line x1="16" y1="5.2" x2="16" y2="9.5" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
            <ellipse cx="16" cy="12.5" rx="1.3" ry="2.6" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
            <line x1="16" y1="15.1" x2="16" y2="18.2" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
            <ellipse cx="16" cy="21" rx="1.3" ry="2.6" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
            <line x1="16" y1="23.6" x2="16" y2="26.8" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
            <ellipse cx="16" cy="29.5" rx="1.4" ry="2.6" stroke="currentColor" strokeWidth="0.75" opacity="0.75" />

            {/* Sigil Connector Ring */}
            <circle cx="16" cy="34.5" r="2" stroke="currentColor" strokeWidth="0.9" opacity="0.8" />

            {/* Hanging Royal Sigil with secondary pendulum lag */}
            <g
              className={`sigil-secondary-pendulum ${reduced ? "" : "animate-sigil-secondary"}`}
              style={{ transformOrigin: "16px 34.5px" }}
            >
              {/* Outer Beveled Bronze/Gold Diamond Seal */}
              <path
                d="M16 36.5 L26.5 47 L16 57.5 L5.5 47 Z"
                fill="oklch(0.13 0.008 60)"
                stroke="currentColor"
                strokeWidth="1.1"
                className="transition-colors duration-300"
              />

              {/* Inner Inscribed Rhombus Line */}
              <path
                d="M16 39.5 L23.5 47 L16 54.5 L8.5 47 Z"
                stroke="currentColor"
                strokeWidth="0.65"
                opacity="0.5"
              />

              {/* Ancient Inscribed Emblem Cross */}
              <path
                d="M16 42 L16 52 M11 47 L21 47"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeLinecap="round"
                opacity="0.65"
              />

              {/* Center Core Rivet */}
              <circle cx="16" cy="47" r="1.3" fill="currentColor" opacity="0.9" />
              <circle cx="16" cy="47" r="0.5" fill="oklch(0.92 0.015 80)" opacity="0.8" />
            </g>
          </svg>
        </div>
      </a>
    </div>
  );
}
