import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { GraduationCap, Plus } from "lucide-react";
import { chronicles, education } from "@/data/portfolio";
import { Reveal, SectionHeading, SectionShell, TechBadge } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { DragonEgg } from "@/components/site/DragonEgg";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * THE CHRONICLES — the record writes itself.
 *
 * Structure:
 * - EXPERIENCE (Hind AI, Crobstacle Ventures LLP)
 * - EDUCATION (Graphic Era Deemed University, MCA)
 *
 * Drawn by the reader's own progress down the page.
 */
export function ChroniclesTimeline() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [openEdu, setOpenEdu] = useState(true);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 78%", "end 62%"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });
  const nibTop = useTransform(drawn, (v) => `${v * 100}%`);
  const nibOpacity = useTransform(drawn, [0, 0.02, 0.96, 1], [0, 1, 1, 0]);

  return (
    <SectionShell id="chronicles">
      <Reveal>
        <SectionHeading
          eyebrow="The Kingdom"
          title="THE CHRONICLES"
          subtitle="A record of service, kept in order."
        />
      </Reveal>

      <div ref={railRef} className="relative mt-16 pl-6 sm:pl-10">
        {/* unwritten rail */}
        <div className="absolute top-2 bottom-2 left-0 w-px bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] sm:left-3" />

        {/* written ink */}
        <motion.div
          aria-hidden
          className="absolute top-2 bottom-2 left-0 w-px origin-top bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--gold)_18%,transparent),color-mix(in_oklab,var(--gold)_62%,transparent))] sm:left-3"
          style={reduced ? { scaleY: 1 } : { scaleY: drawn }}
        />

        {/* the nib */}
        {reduced ? null : (
          <motion.span
            aria-hidden
            className="absolute left-0 z-10 -ml-[3px] h-1.5 w-1.5 rounded-full bg-gold sm:left-3"
            style={{
              top: nibTop,
              opacity: nibOpacity,
              boxShadow: "0 0 14px 3px color-mix(in oklab, var(--gold) 45%, transparent)",
              animation: "chronicle-nib 2.4s ease-in-out infinite",
            }}
          />
        )}

        {/* ── 1. EXPERIENCE ── */}
        <div className="mb-6">
          <p className="font-mono text-[0.68rem] tracking-[0.32em] text-gold uppercase opacity-90">
            Experience
          </p>
        </div>

        <ul className="space-y-6">
          {chronicles.map((entry, i) => (
            <ChronicleEntry
              key={entry.house}
              entry={entry}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </ul>

        {/* ── 2. EDUCATION ── */}
        <div className="mt-12 mb-6">
          <p className="font-mono text-[0.68rem] tracking-[0.32em] text-gold uppercase opacity-90">
            Education
          </p>
        </div>

        <ul className="space-y-6">
          {education.map((edu) => (
            <EducationEntry
              key={edu.institution}
              edu={edu}
              open={openEdu}
              onToggle={() => setOpenEdu(!openEdu)}
            />
          ))}
        </ul>

        {/* Hidden Dragon Egg #3 — Resting near the ancient foundation of The Chronicles */}
        <div className="mt-8 flex items-center justify-between pl-2 sm:pl-4">
          <DragonEgg
            id="egg-chronicles"
            relicNumber="III"
            title="The Enterprise Vanguard"
            subtitle="Preserved within the Chronicles Archive"
            detail="Production software engineering foundation. Delivered resilient REST APIs, database optimizations, and automated backend workflows."
            popupPlacement="top-right"
          />

          {/* Personal Signature Motto */}
          <p className="font-display text-[0.6rem] sm:text-[0.66rem] tracking-[0.34em] text-gold-dim/70 uppercase select-none">
            BORN OF THE NORTH. FORGED IN CODE.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

type Entry = (typeof chronicles)[number];

function ChronicleEntry({
  entry,
  open,
  onToggle,
}: {
  entry: Entry;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLLIElement | null>(null);
  const reached = useInView(ref, { once: true, margin: "-30% 0px -34% 0px" });
  const unsealed = reduced || reached;

  return (
    <li ref={ref} className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute top-8 -left-6 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border transition-all duration-700 sm:-left-7",
          unsealed
            ? open
              ? "border-gold bg-gold shadow-[0_0_18px_2px_color-mix(in_oklab,var(--gold)_50%,transparent)]"
              : "border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-background"
            : "scale-75 border-border bg-background opacity-40",
        )}
      />

      <motion.div
        className="panel-stone rounded-sm"
        initial={reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={
          unsealed
            ? { opacity: 1, clipPath: "inset(0 0 0% 0)" }
            : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
        }
        transition={{ duration: 0.9, ease: EASE }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-4 p-6 text-left"
        >
          <span>
            <span className="block font-mono text-[0.62rem] tracking-[0.28em] text-gold-dim uppercase">
              {entry.period}
            </span>
            <span className="mt-3 block font-display text-lg tracking-[0.1em] text-parchment uppercase sm:text-xl">
              {entry.house}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">{entry.role}</span>
          </span>
          <Plus
            className={cn(
              "mt-1 h-4 w-4 shrink-0 text-gold-dim transition-transform duration-500",
              open && "rotate-45",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="space-y-6 border-t border-border/70 px-6 py-6">
                <p className="text-sm text-muted-foreground italic">{entry.summary}</p>
                <Block title="Responsibilities" items={entry.responsibilities} />
                <Block title="Achievements" items={entry.achievements} />
                <div>
                  <p className="eyebrow">Technologies</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.technologies.map((t) => (
                      <TechBadge key={t} label={t} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </li>
  );
}

type EduEntry = (typeof education)[number];

function EducationEntry({
  edu,
  open,
  onToggle,
}: {
  edu: EduEntry;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLLIElement | null>(null);
  const reached = useInView(ref, { once: true, margin: "-30% 0px -34% 0px" });
  const unsealed = reduced || reached;

  return (
    <li ref={ref} className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute top-8 -left-6 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border transition-all duration-700 sm:-left-7",
          unsealed
            ? open
              ? "border-gold bg-gold shadow-[0_0_18px_2px_color-mix(in_oklab,var(--gold)_50%,transparent)]"
              : "border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-background"
            : "scale-75 border-border bg-background opacity-40",
        )}
      />

      <motion.div
        className="panel-stone rounded-sm"
        initial={reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={
          unsealed
            ? { opacity: 1, clipPath: "inset(0 0 0% 0)" }
            : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
        }
        transition={{ duration: 0.9, ease: EASE }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-4 p-6 text-left"
        >
          <span>
            <div className="flex items-center gap-3">
              <span className="block font-mono text-[0.62rem] tracking-[0.28em] text-gold-dim uppercase">
                {edu.period} ({edu.dates})
              </span>
              <span className="font-mono text-[0.62rem] tracking-[0.18em] text-gold bg-gold/10 px-2 py-0.5 rounded-sm">
                {edu.grade}
              </span>
            </div>
            <span className="mt-3 block font-display text-lg tracking-[0.1em] text-parchment uppercase sm:text-xl">
              {edu.institution}
            </span>
            <span className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-gold-dim" />
              {edu.degree}
            </span>
          </span>
          <Plus
            className={cn(
              "mt-1 h-4 w-4 shrink-0 text-gold-dim transition-transform duration-500",
              open && "rotate-45",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="space-y-6 border-t border-border/70 px-6 py-6">
                <p className="text-sm text-muted-foreground italic">{edu.summary}</p>
                <Block title="Curriculum & Highlights" items={edu.highlights} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </li>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-muted-foreground">
            <span className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold-dim" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
