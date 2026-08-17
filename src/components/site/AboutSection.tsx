import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { SectionShell } from "@/components/site/primitives";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DragonEgg } from "@/components/site/DragonEgg";

const coreStack = [
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "FastAPI",
  "Spring Boot",
  "React",
  "Next.js",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "AWS",
  "Docker",
  "AI / LLM APIs",
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Staggered but overlapping — one continuous cinematic event, settled by ~1.8s. */
const BEAT = {
  atmosphere: 0,
  eyebrow: 120,
  heading: 260,
  rule: 470,
  copy: 560,
  panel: 700,
  badges: 900,
  rows: 1080,
} as const;

function useArrival(ref: React.RefObject<HTMLElement | null>, reduced: boolean) {
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    if (reduced) {
      setArrived(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArrived(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, reduced]);
  return arrived;
}

export function AboutSection() {
  const reduced = !!useReducedMotion();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const arrived = useArrival(sectionRef, reduced);
  const interactive = !reduced && !isMobile;

  /* -------- restrained scroll parallax -------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 30, mass: 0.6 });
  const yLeft = useTransform(p, [0, 1], [3, -3]);
  const yPanel = useTransform(p, [0, 1], [5, -5]);
  const yAtmos = useTransform(p, [0, 1], [7, -7]);

  /* -------- ambient cursor light + heavy panel drift -------- */
  const lightRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;
    const el = sectionRef.current;
    if (!el) return;

    let targetX = 0.5;
    let targetY = 0.5;
    let x = 0.5;
    let y = 0.5;
    let targetOn = 0;
    let on = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetX = (e.clientX - r.left) / r.width;
      targetY = (e.clientY - r.top) / r.height;
      targetOn = 1;
    };
    const onLeave = () => {
      targetOn = 0;
    };

    const loop = () => {
      x += (targetX - x) * 0.035;
      y += (targetY - y) * 0.035;
      on += (targetOn - on) * 0.05;
      if (lightRef.current) {
        lightRef.current.style.background = `radial-gradient(46rem 34rem at ${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%, color-mix(in oklab, var(--gold) 9%, transparent), transparent 70%)`;
        lightRef.current.style.opacity = (on * 0.55).toFixed(3);
      }
      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(${((x - 0.5) * 4).toFixed(2)}px, ${((y - 0.5) * 4).toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  const dust = useMemo(() => {
    const count = isMobile ? 6 : 10;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 6 + ((i * 37) % 88),
      top: 10 + ((i * 53) % 78),
      size: i % 3 === 0 ? 2 : 1,
      duration: 26 + ((i * 9) % 34),
      delay: -(i * 4.3),
      opacity: 0.05 + ((i % 4) * 0.025),
    }));
  }, [isMobile]);

  const step = (delay: number, extra?: React.CSSProperties): React.CSSProperties =>
    reduced
      ? { ...extra }
      : {
          transition: `opacity 1400ms ${EASE} ${delay}ms, transform 1400ms ${EASE} ${delay}ms, filter 1400ms ${EASE} ${delay}ms, clip-path 1500ms ${EASE} ${delay}ms`,
          ...extra,
        };

  const hidden = !reduced && !arrived;

  return (
    <SectionShell id="citadel" className="overflow-hidden">
      <div ref={sectionRef} className="relative">
        {/* ---------- atmosphere ---------- */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -inset-y-16 -z-10"
          style={{ y: reduced ? 0 : yAtmos }}
        >
          {/* base chamber exposure */}
          <div
            className="absolute inset-0"
            style={{
              ...step(BEAT.atmosphere),
              opacity: hidden ? 0 : 1,
              background:
                "radial-gradient(60% 55% at 50% 40%, color-mix(in oklab, var(--gold) 3%, transparent), transparent 75%)",
            }}
          />
          {/* distant torch — extremely slow warm drift */}
          <div
            className="absolute inset-0"
            style={{
              opacity: hidden ? 0 : 1,
              transition: reduced ? undefined : `opacity 1600ms ${EASE} 200ms`,
            }}
          >
            <div
              className="absolute -left-1/4 top-0 h-full w-[70%]"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 10%, transparent), transparent 70%)",
                animation: reduced ? undefined : "citadel-torch 48s ease-in-out infinite",
                filter: "blur(30px)",
              }}
            />
            <div
              className="absolute -right-1/5 bottom-0 h-[80%] w-[55%]"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--crimson) 6%, transparent), transparent 72%)",
                animation: reduced ? undefined : "citadel-torch 71s ease-in-out infinite reverse",
                filter: "blur(38px)",
              }}
            />
          </div>

          {/* suspended dust */}
          {!reduced &&
            dust.map((d) => (
              <span
                key={d.id}
                className="absolute rounded-full bg-[color-mix(in_oklab,var(--gold)_70%,white)]"
                style={{
                  left: `${d.left}%`,
                  top: `${d.top}%`,
                  width: d.size,
                  height: d.size,
                  opacity: hidden ? 0 : d.opacity,
                  transition: `opacity 2000ms ${EASE} ${400 + d.id * 60}ms`,
                  animation: `citadel-dust ${d.duration}s ease-in-out ${d.delay}s infinite`,
                }}
              />
            ))}
        </motion.div>

        {/* ambient cursor light */}
        {interactive ? (
          <div
            ref={lightRef}
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -inset-y-16 -z-10 opacity-0"
          />
        ) : null}

        {/* film grain */}
        <div
          aria-hidden
          className="grain-overlay pointer-events-none absolute -inset-x-8 -inset-y-16 -z-10"
          style={{ opacity: hidden ? 0 : 0.5, transition: `opacity 1800ms ${EASE} 300ms` }}
        />

        <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          {/* ---------- left column ---------- */}
          <motion.div style={{ y: reduced ? 0 : yLeft }}>
            <div className="max-w-3xl text-left">
              <p
                className="eyebrow"
                style={{
                  ...step(BEAT.eyebrow),
                  opacity: hidden ? 0 : 1,
                  filter: hidden ? "brightness(0.35)" : "brightness(1)",
                }}
              >
                The Citadel
              </p>

              {/* masked vertical reveal — emerges from darkness */}
              <div className="mt-4 overflow-hidden">
                <h2
                  className="text-3xl leading-tight sm:text-4xl md:text-5xl text-gold-gradient"
                  style={{
                    ...step(BEAT.heading),
                    opacity: hidden ? 0 : 1,
                    transform: hidden ? "translate3d(0,18%,0)" : "translate3d(0,0,0)",
                    clipPath: hidden ? "inset(100% 0 0 0)" : "inset(0% 0 0 0)",
                    filter: hidden ? "brightness(0.25)" : "brightness(1)",
                  }}
                >
                  THE MAN BEHIND THE CROWN
                </h2>
              </div>

              <div
                className="rule-gold mt-6 w-40 origin-left"
                style={{
                  ...step(BEAT.rule),
                  opacity: hidden ? 0 : 1,
                  transform: hidden ? "scaleX(0.2)" : "scaleX(1)",
                }}
              />
            </div>

            <div
              className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground"
              style={{
                ...step(BEAT.copy),
                opacity: hidden ? 0 : 1,
                transform: hidden ? "translate3d(0,10px,0)" : "translate3d(0,0,0)",
                filter: hidden ? "brightness(0.5) saturate(0.6)" : "brightness(1) saturate(1)",
              }}
            >
              <p>
                <span className="text-foreground">Sumit Singh</span> is a Software Engineer focused
                on building backend systems, APIs, AI-powered applications and modern web products.
              </p>
              <p>
                His work sits where reliability meets ambition: services that hold up under load,
                data models that stay honest, and AI features grounded in real context instead of
                guesswork. He started in large-scale infrastructure, then moved into software — and
                carried the same discipline with him.
              </p>
              <p>
                He builds end to end: designing the schema, writing the service, wiring the
                retrieval layer, and shipping the interface that makes it useful.
              </p>
            </div>
          </motion.div>

          {/* ---------- right panel ---------- */}
          <motion.div style={{ y: reduced ? 0 : yPanel }}>
            <div ref={panelRef} style={{ willChange: interactive ? "transform" : undefined }}>
              <div
                className="panel-stone grain-overlay rounded-sm p-7"
                style={{
                  ...step(BEAT.panel),
                  opacity: hidden ? 0 : 1,
                  filter: hidden
                    ? "brightness(0.18) saturate(0.4)"
                    : "brightness(1) saturate(1)",
                }}
              >
                <p className="eyebrow">Sworn Instruments</p>
                <div className="rule-gold mt-4 w-full" />

                <div
                  className="mt-6 flex flex-wrap gap-2"
                  style={{
                    ...step(BEAT.badges),
                    opacity: hidden ? 0 : 1,
                    transform: hidden ? "translate3d(0,6px,0)" : "translate3d(0,0,0)",
                  }}
                >
                  {coreStack.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "citadel-badge rounded-sm border border-[color-mix(in_oklab,var(--gold)_22%,transparent)] bg-[color-mix(in_oklab,var(--card)_70%,transparent)] px-3 py-1.5 font-mono text-[0.68rem] tracking-wide text-muted-foreground hover:border-[color-mix(in_oklab,var(--gold)_45%,transparent)] hover:text-gold",
                        tech === "Java" && "citadel-glint-badge",
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div
                  className="mt-8 space-y-3 border-t border-border/70 pt-6"
                  style={{
                    ...step(BEAT.rows),
                    opacity: hidden ? 0 : 1,
                    transform: hidden ? "translate3d(0,6px,0)" : "translate3d(0,0,0)",
                  }}
                >
                  <Row
                    label="Discipline"
                    value="Backend / Full-stack"
                    stamped={arrived}
                    stampDelay={BEAT.rows}
                    reduced={reduced}
                  />
                  <Row
                    label="Focus"
                    value="APIs, distributed workflows, applied AI"
                    stamped={arrived}
                    stampDelay={BEAT.rows + 70}
                    reduced={reduced}
                  />
                  <Row
                    label="Education"
                    value="MCA · Graphic Era"
                    last
                    stamped={arrived}
                    stampDelay={BEAT.rows + 140}
                    reduced={reduced}
                  />
                </div>

                {/* Hidden Dragon Egg #2 — Nestled in the stone recess of the Citadel */}
                <div className="mt-4 flex justify-end">
                  <DragonEgg
                    id="egg-citadel"
                    relicNumber="II"
                    title="The Forged Scholar"
                    subtitle="Unearthed within the Citadel Vaults"
                    detail="Master of Computer Applications at Graphic Era Deemed University (8.00 CGPA) coupled with deep domain mastery in backend systems, RAG architectures, and production APIs."
                    popupPlacement="top-left"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}

function Row({
  label,
  value,
  last,
  stamped,
  stampDelay = 0,
  reduced,
}: {
  label: string;
  value: string;
  last?: boolean;
  stamped?: boolean;
  stampDelay?: number;
  reduced?: boolean;
}) {
  return (
    <div className="citadel-row group">
      <div className="flex items-baseline justify-between gap-4">
        <span className="citadel-row-label font-mono text-[0.62rem] tracking-[0.22em] text-gold-dim uppercase group-hover:text-gold">
          {label}
        </span>
        <span
          className={cn(
            "citadel-row-value text-right text-sm text-muted-foreground group-hover:text-foreground",
            stamped && !reduced && "citadel-value-stamped",
          )}
          style={{
            animationDelay: stamped && !reduced ? `${stampDelay}ms` : undefined,
            opacity: stamped || reduced ? 1 : 0,
          }}
        >
          {value}
        </span>
      </div>
      <div
        className={cn(
          "citadel-row-line mt-3 h-px w-full bg-border/40 group-hover:bg-[color-mix(in_oklab,var(--gold)_28%,transparent)]",
          last && "hidden",
        )}
      />
    </div>
  );
}
