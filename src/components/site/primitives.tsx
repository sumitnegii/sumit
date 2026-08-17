import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Medieval metal / stone control. Used instead of default shadcn buttons. */
export const relicButton = cva(
  "relative inline-flex items-center justify-center gap-2 font-display text-[0.7rem] sm:text-xs uppercase tracking-[0.28em] transition-all duration-500 select-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        forged:
          "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--gold)_22%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] text-gold border border-[color-mix(in_oklab,var(--gold)_45%,transparent)] hover:border-gold hover:shadow-[var(--shadow-glow)] hover:text-parchment",
        stone:
          "bg-[color-mix(in_oklab,var(--card)_80%,transparent)] text-muted-foreground border border-border hover:text-foreground hover:border-[color-mix(in_oklab,var(--gold)_40%,transparent)]",
        blood:
          "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--crimson)_75%,transparent),color-mix(in_oklab,var(--background)_85%,transparent))] text-parchment border border-[color-mix(in_oklab,var(--crimson)_70%,transparent)] hover:shadow-[0_0_36px_-10px_var(--crimson)]",
        ghost: "text-muted-foreground hover:text-gold",
      },
      size: {
        sm: "px-4 py-2",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-xs sm:text-sm",
      },
    },
    defaultVariants: { variant: "forged", size: "md" },
  },
);

export type RelicButtonProps = VariantProps<typeof relicButton>;

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl leading-tight sm:text-4xl md:text-5xl text-gold-gradient">
        {title}
      </h2>
      <div className={cn("rule-gold mt-6 w-40", align === "center" && "mx-auto")} />
      {subtitle ? (
        <p className="mt-5 text-sm sm:text-base text-muted-foreground italic">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionShell({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 px-5 py-24 sm:px-8 md:py-32", className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function TechBadge({ label }: { label: string }) {
  return (
    <span className="rounded-sm border border-[color-mix(in_oklab,var(--gold)_22%,transparent)] bg-[color-mix(in_oklab,var(--card)_70%,transparent)] px-3 py-1.5 font-mono text-[0.68rem] tracking-wide text-muted-foreground transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--gold)_60%,transparent)] hover:text-gold">
      {label}
    </span>
  );
}
