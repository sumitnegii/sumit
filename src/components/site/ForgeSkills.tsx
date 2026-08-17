import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { skillGroups } from "@/data/portfolio";
import { Reveal, SectionHeading, SectionShell } from "@/components/site/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * THE FORGE — skills are forged, not listed.
 *
 * Each category is a dark metal plate. When the plate enters the viewport a
 * single pass of forge light travels across it; the engraving resolves in
 * that light and then the plate goes quiet again. One event per plate, once.
 */
export function ForgeSkills() {
  return (
    <SectionShell id="forge" className="relative overflow-hidden">
      <ForgeGlow />

      <Reveal>
        <SectionHeading
          eyebrow="The Forge"
          title="THE FORGE"
          subtitle="Weapons are forged. Skills are earned."
        />
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <ForgePlate key={group.name} name={group.name} items={group.items} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}

/** A slow, low heat behind the whole section — never a "glow", just warmth. */
function ForgeGlow() {
  const reduced = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
      style={{
        background:
          "radial-gradient(58% 46% at 50% 100%, color-mix(in oklab, var(--ember) 12%, transparent), transparent 70%)",
        opacity: reduced ? 0.2 : undefined,
        animation: reduced ? undefined : "forge-heat 11s ease-in-out infinite",
      }}
    />
  );
}

function ForgePlate({
  name,
  items,
  index,
}: {
  name: string;
  items: string[];
  index: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const struck = useInView(ref, { once: true, margin: "-14% 0px -14% 0px" });
  const on = reduced || struck;
  const delay = Math.min(index * 0.12, 0.5);

  return (
    <div ref={ref} className="relative">
      <motion.div
        className="relative h-full overflow-hidden rounded-[2px] p-6"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 1, delay, ease: EASE }}
        style={{
          background:
            "linear-gradient(160deg, oklch(0.20 0.008 60), oklch(0.13 0.006 50) 55%, oklch(0.16 0.008 60))",
          border: "1px solid color-mix(in oklab, var(--gold) 18%, transparent)",
          boxShadow:
            "inset 0 1px 0 color-mix(in oklab, var(--gold) 12%, transparent), inset 0 -1px 0 oklch(0 0 0 / 0.6), 0 12px 30px -22px oklch(0 0 0)",
        }}
      >
        {/* the single strike of forge light */}
        {on && !reduced ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--gold) 22%, transparent), transparent)",
              animation: `forge-sweep 1.5s ${EASE ? "cubic-bezier(0.22,1,0.36,1)" : "ease"} ${delay + 0.15}s 1 both`,
            }}
          />
        ) : null}

        <div className="relative flex items-center gap-3">
          <span className="h-1.5 w-1.5 rotate-45 bg-ember shadow-[0_0_10px_1px_color-mix(in_oklab,var(--ember)_45%,transparent)]" />
          <h3
            className="font-display text-xs tracking-[0.3em] uppercase"
            style={{
              color: "color-mix(in oklab, var(--parchment) 88%, transparent)",
              textShadow: "0 1px 0 oklch(0 0 0 / 0.8)",
            }}
          >
            {name}
          </h3>
        </div>

        <div className="rule-gold relative mt-4 w-full" />

        <ul className="relative mt-5 flex flex-wrap gap-x-4 gap-y-2.5">
          {items.map((item, k) => (
            <motion.li
              key={item}
              initial={reduced ? false : { opacity: 0 }}
              animate={on ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: delay + 0.45 + k * 0.045, ease: EASE }}
            >
              <span className="forge-mark font-mono text-[0.72rem] tracking-wide">{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
