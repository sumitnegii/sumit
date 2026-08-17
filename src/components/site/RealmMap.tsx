import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import mapImage from "@/assets/realm-map.jpg";
import { realmLocations } from "@/data/portfolio";
import { Reveal, SectionHeading, SectionShell } from "@/components/site/primitives";
import { DragonEgg } from "@/components/site/DragonEgg";

const EASE_EXPO = "cubic-bezier(0.22, 1, 0.36, 1)";
const ENTRANCE_MS = 1800;
const STAGGER_MS = 200;

const PANEL_W = 260;
const PANEL_H = 118;

type Placement = { left: number; top: number };

/** Ease-in-out cubic smooth scroll, 0.8s, no hash change. */
function smoothScrollTo(target: HTMLElement, reduced: boolean) {
  const top = target.getBoundingClientRect().top + window.scrollY - 90;
  if (reduced) {
    window.scrollTo(0, top);
    return;
  }
  const start = window.scrollY;
  const delta = top - start;
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / 800);
    const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    window.scrollTo(0, start + delta * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function DustLayer({ reduced }: { reduced: boolean }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: (i * 53) % 100,
        top: (i * 29) % 100,
        size: 1 + ((i * 7) % 2),
        opacity: 0.05 + ((i % 4) * 0.023),
        duration: 8 + ((i * 3) % 7),
        delay: (i * 1.3) % 9,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(58% 52% at 48% 46%, rgba(255,180,90,0.03), transparent 72%)",
        }}
      />
      {!reduced &&
        motes.map((m) => (
          <span
            key={m.id}
            className="absolute rounded-full bg-[rgb(255,225,185)]"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              opacity: m.opacity,
              animation: `map-dust ${m.duration}s ease-in-out ${m.delay}s infinite`,
            }}
          />
        ))}
    </div>
  );
}

// Destination routes from center (737, 491) to each hold on 1536x1024 canvas
const REALM_ROUTES: Record<
  string,
  { path: string; endX: number; endY: number }
> = {
  "#citadel": {
    path: "M 737 491 C 614 470, 480 430, 395 365 S 355 325, 338 307",
    endX: 338,
    endY: 307,
  },
  "#chronicles": {
    path: "M 737 491 C 710 395, 765 290, 737 184",
    endX: 737,
    endY: 184,
  },
  "#campaigns": {
    path: "M 737 491 C 860 530, 990 495, 1106 451",
    endX: 1106,
    endY: 451,
  },
  "#forge": {
    path: "M 737 491 C 645 555, 580 605, 507 676",
    endX: 507,
    endY: 676,
  },
  "#raven": {
    path: "M 737 491 C 815 585, 930 690, 1014 799",
    endX: 1014,
    endY: 799,
  },
};

// Compass bearings from compass center (168, 162) to each hold
const COMPASS_BEARINGS: Record<string, number> = {
  "#citadel": 130.4,
  "#chronicles": 92.2,
  "#campaigns": 107.1,
  "#forge": 146.6,
  "#raven": 127.0,
};

/**
 * LivingCompass — Subtle physical needle suspended at the map's compass rose.
 * Points to True North (0deg) at rest, and smoothly turns toward destination holds on interaction.
 */
function LivingCompass({
  activeLoc,
  reduced,
}: {
  activeLoc: string | null;
  reduced: boolean;
}) {
  const targetAngle =
    activeLoc && COMPASS_BEARINGS[activeLoc] !== undefined
      ? COMPASS_BEARINGS[activeLoc]!
      : 0;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-15 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{
        left: "10.94%",
        top: "15.82%",
        width: "116px",
        height: "116px",
      }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `rotate(${targetAngle}deg)`,
          transition: reduced
            ? "none"
            : "transform 850ms cubic-bezier(0.34, 1.25, 0.64, 1)",
          transformOrigin: "50% 50%",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="h-full w-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
        >
          {/* North Pointing Half (Antique Gold) */}
          <polygon
            points="50,14 54,50 50,47"
            fill="oklch(0.74 0.09 76)"
            opacity="0.85"
          />
          <polygon
            points="50,14 46,50 50,47"
            fill="oklch(0.48 0.06 60)"
            opacity="0.9"
          />
          {/* North Tip Fleur Accent */}
          <path
            d="M50 12 L51.5 15 L50 14 L48.5 15 Z"
            fill="oklch(0.86 0.11 82)"
            opacity="0.95"
          />

          {/* South Pointing Half (Dark Iron / Bronze) */}
          <polygon
            points="50,86 53.5,50 50,53"
            fill="oklch(0.34 0.04 55)"
            opacity="0.8"
          />
          <polygon
            points="50,86 46.5,50 50,53"
            fill="oklch(0.22 0.03 50)"
            opacity="0.85"
          />

          {/* Center Brass Pivot Collar & Rivet */}
          <circle
            cx="50"
            cy="50"
            r="4.2"
            fill="oklch(0.2 0.02 50)"
            stroke="oklch(0.66 0.08 75)"
            strokeWidth="1"
          />
          <circle cx="50" cy="50" r="2" fill="oklch(0.76 0.09 80)" />
          <circle cx="50" cy="50" r="0.8" fill="oklch(0.95 0.02 90)" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}

/**
 * LocationRoutesLayer — Luminous cartographic trade & march routes drawn on ancient parchment.
 * Connects the central kingdom hub to destination holds with brilliant warm gold illumination.
 */
function LocationRoutesLayer({
  activeLoc,
  reduced,
}: {
  activeLoc: string | null;
  reduced: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1536 1024"
      fill="none"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-15 h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        {/* Luminous Royal Gold Gradient */}
        <linearGradient id="route-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2b668" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ffdd94" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff6dc" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Central Realm Hub Compass Marker (Illuminated when any route is active) */}
      {activeLoc && REALM_ROUTES[activeLoc] && (
        <g className="transition-opacity duration-300 ease-out" style={{ opacity: 1 }}>
          <circle
            cx="737"
            cy="491"
            r="14"
            fill="none"
            stroke="rgba(255, 215, 120, 0.45)"
            strokeWidth="1.5"
            className="animate-ping"
            style={{ transformOrigin: "737px 491px", animationDuration: "2.8s" }}
          />
          <circle
            cx="737"
            cy="491"
            r="5.5"
            fill="#e2b668"
            stroke="#120e0a"
            strokeWidth="1.8"
            filter="drop-shadow(0 0 8px rgba(255, 215, 120, 0.95))"
          />
          <circle cx="737" cy="491" r="2" fill="#ffffff" />
        </g>
      )}

      {Object.entries(REALM_ROUTES).map(([href, info]) => {
        const isActive = activeLoc === href;
        const d = info.path;
        return (
          <g
            key={href}
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity 300ms ease-out",
            }}
          >
            {/* 1. Luminous Warm Gold Ambient Halo Glow */}
            <path
              d={d}
              stroke="rgba(255, 205, 105, 0.55)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              pathLength={1000}
              strokeDasharray={1000}
              style={{
                strokeDashoffset: isActive || reduced ? 0 : 1000,
                filter: "blur(3.5px)",
                transition: reduced
                  ? "none"
                  : isActive
                    ? "stroke-dashoffset 750ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "stroke-dashoffset 0ms linear 300ms",
              }}
            />

            {/* 2. Vibrant Royal Gold Solid Core Line */}
            <path
              d={d}
              stroke="url(#route-gold-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray={1000}
              fill="none"
              style={{
                strokeDashoffset: isActive || reduced ? 0 : 1000,
                filter: "drop-shadow(0 0 6px rgba(255, 215, 120, 0.85))",
                transition: reduced
                  ? "none"
                  : isActive
                    ? "stroke-dashoffset 750ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "stroke-dashoffset 0ms linear 300ms",
              }}
            />

            {/* 3. Fine Cartographic Dashed Detail Line */}
            <path
              d={d}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="9 7"
              pathLength={1000}
              fill="none"
              opacity="0.95"
              style={{
                strokeDashoffset: isActive || reduced ? 0 : 1000,
                transition: reduced
                  ? "none"
                  : isActive
                    ? "stroke-dashoffset 750ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "stroke-dashoffset 0ms linear 300ms",
              }}
            />

            {/* 4. Destination Waypoint Beacon */}
            {isActive && (
              <g className="transition-opacity duration-300 ease-out">
                <circle
                  cx={info.endX}
                  cy={info.endY}
                  r="18"
                  fill="none"
                  stroke="rgba(255, 215, 120, 0.6)"
                  strokeWidth="1.5"
                  className="animate-ping"
                  style={{
                    transformOrigin: `${info.endX}px ${info.endY}px`,
                    animationDuration: "2.2s",
                  }}
                />
                <circle
                  cx={info.endX}
                  cy={info.endY}
                  r="6.5"
                  fill="#ffd88a"
                  stroke="#120e0a"
                  strokeWidth="1.8"
                  filter="drop-shadow(0 0 10px rgba(255, 220, 130, 1))"
                />
                <circle cx={info.endX} cy={info.endY} r="2.2" fill="#ffffff" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function RealmMap() {
  const reduced = !!useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);

  // Scroll-triggered entrance
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const markersIn = revealed || reduced;

  // Damped pointer parallax (pointer-fine only)
  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = containerRef.current;
    const layer = parallaxRef.current;
    if (!el || !layer) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2 * 6;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2 * 4;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    const loop = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      layer.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const openPanel = useCallback((href: string, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const openLeft = vw - r.right < 250;
    const openBelow = r.top < 150;

    let left = openLeft ? r.left - PANEL_W - 8 : r.right + 8;
    let top = openBelow ? r.bottom + 8 : r.top - 8;

    left = Math.min(Math.max(left, 16), vw - PANEL_W - 16);
    top = Math.min(Math.max(top, 16), vh - PANEL_H - 16);

    setPlacement({ left, top });
    setActive(href);
  }, []);

  const closePanel = useCallback(() => {
    setActive(null);
    setPlacement(null);
  }, []);

  // Close on outside tap / escape
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) closePanel();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, closePanel]);

  const activeLoc = realmLocations.find((l) => l.href === active) ?? null;

  return (
    <SectionShell id="map" className="pt-16 md:pt-24">
      <Reveal>
        <SectionHeading
          eyebrow="The Realm"
          title="A MAP OF THE KINGDOM"
          subtitle="Five holds. Each one a part of the record."
        />
      </Reveal>

      <div
        ref={containerRef}
        className="relative mt-14 overflow-hidden rounded-sm border border-[color-mix(in_oklab,var(--gold)_22%,transparent)] shadow-[var(--shadow-relic)]"
      >
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          style={{ scale: "1.02" } as React.CSSProperties}
        >
          <img
            src={mapImage}
            alt="Hand-drawn parchment map of an imagined kingdom with mountains, forests and castles"
            width={1536}
            height={1024}
            loading="lazy"
            className="h-full w-full scale-[1.03] object-cover contrast-110"
            style={{
              opacity: reduced || revealed ? 0.7 : 0.15,
              filter: reduced || revealed ? "brightness(1) blur(0px)" : "brightness(0.4) blur(2px)",
              transition: reduced
                ? undefined
                : `opacity ${ENTRANCE_MS}ms ${EASE_EXPO}, filter ${ENTRANCE_MS}ms ${EASE_EXPO}`,
            }}
          />

          {/* Living Compass overlay matching map artwork */}
          <LivingCompass activeLoc={active} reduced={reduced} />

          {/* Location Path Reveal overlay */}
          <LocationRoutesLayer activeLoc={active} reduced={reduced} />

          {/* Hidden Dragon Egg #1 — Resting on the southwest mountainous crags of The Realm */}
          <div
            className="pointer-events-auto absolute z-20"
            style={{ left: "5.5%", top: "85%" }}
          >
            <DragonEgg
              id="egg-realm"
              relicNumber="I"
              title="The Architect's Ledger"
              subtitle="Unearthed in the high crags of The Realm"
              detail="Mastery over high-throughput distributed microservices, low-latency APIs, and cloud infrastructure engineered across Java, Python, and scalable relational / document databases."
              popupPlacement="top-right"
            />
          </div>
        </div>

        {/* spacer keeps section height while the image is absolutely positioned */}
        <div className="h-[360px] w-full sm:h-[520px] md:h-[620px]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_50%,transparent,oklch(0_0_0/0.82))]" />

        <DustLayer reduced={reduced} />

        {realmLocations.map((loc, i) => {
          const isActive = active === loc.href;
          return (
            <button
              key={loc.href}
              type="button"
              aria-label={`${loc.name} — ${loc.blurb}`}
              className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                opacity: markersIn ? 1 : 0,
                transform: `translate(-50%, -50%) scale(${markersIn ? (isActive ? 1.08 : 1) : 0.8})`,
                transition: reduced
                  ? undefined
                  : `opacity 500ms ease-out ${ENTRANCE_MS + i * STAGGER_MS}ms, transform 300ms ease-out`,
              }}
              onMouseEnter={(e) => openPanel(loc.href, e.currentTarget)}
              onMouseLeave={closePanel}
              onFocus={(e) => openPanel(loc.href, e.currentTarget)}
              onBlur={closePanel}
              onClick={(e) => {
                const el = document.querySelector<HTMLElement>(loc.href);
                if (window.matchMedia("(hover: none)").matches && !isActive) {
                  openPanel(loc.href, e.currentTarget);
                  return;
                }
                if (el) smoothScrollTo(el, reduced);
                closePanel();
              }}
            >
              <span className="relative mx-auto block h-2.5 w-2.5">
                <span
                  aria-hidden
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                  style={{
                    width: 48,
                    height: 48,
                    background: "radial-gradient(circle, rgba(230,160,60,0.25), transparent 70%)",
                    filter: "blur(8px)",
                    animation:
                      !reduced && isActive ? "realm-marker-glow 1.6s ease-in-out infinite" : undefined,
                  }}
                />
                <span
                  className="absolute inset-0 rounded-full bg-ember"
                  style={{
                    animation:
                      !reduced && isActive ? "realm-marker-pulse 1.6s ease-in-out infinite" : undefined,
                  }}
                />
              </span>
              <span
                className="mt-2 block font-display text-[0.55rem] tracking-[0.2em] uppercase transition-all duration-300 sm:text-[0.68rem]"
                style={{
                  color: isActive ? "var(--parchment)" : "color-mix(in oklab, var(--parchment) 68%, transparent)",
                  filter: isActive ? "brightness(1.2)" : undefined,
                }}
              >
                {loc.name}
              </span>
            </button>
          );
        })}
      </div>

      {activeLoc && placement ? (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50"
          style={{
            left: placement.left,
            top: placement.top,
            width: PANEL_W,
            animation: reduced ? undefined : "realm-panel-in 250ms ease-out both",
          }}
        >
          <div
            className="px-4 py-3"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--parchment) 92%, transparent), color-mix(in oklab, var(--parchment) 76%, transparent))",
              border: "1px solid rgba(200,160,90,0.4)",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <p className="font-display text-[0.7rem] tracking-[0.22em] text-[oklch(0.28_0.03_60)] uppercase">
              {activeLoc.name}
            </p>
            <p className="mt-1.5 text-[0.8rem] leading-snug text-[oklch(0.34_0.02_60)] italic">
              {activeLoc.blurb}
            </p>
            <p className="mt-2 font-mono text-[0.6rem] tracking-widest text-[oklch(0.42_0.03_70)] uppercase">
              {activeLoc.meaning}
            </p>
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}
