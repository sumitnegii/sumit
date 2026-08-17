import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Download, FileText } from "lucide-react";
import { profile, royalRecordsStats } from "@/data/portfolio";
import { SectionShell, relicButton } from "@/components/site/primitives";
import { SwordRevealResume } from "@/components/site/resume/SwordRevealResume";

/**
 * ROYAL RECORDS — the calm after the campaigns.
 *
 * Enriched with 3 verified facts from Sumit's academic & engineering record
 * before the cinematic sword-cut resume reveal.
 */
export function ResumeSection() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const lit = useInView(ref, { once: true, margin: "-18% 0px -18% 0px" });
  const on = reduced || lit;
  const [viewing, setViewing] = useState(false);

  return (
    <SectionShell id="records">
      <div ref={ref}>
        <motion.div
          className="panel-parchment relative mx-auto max-w-4xl overflow-hidden rounded-sm px-6 py-12 text-center sm:px-14 sm:py-16"
          initial={reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)", filter: "brightness(0.35)" }}
          animate={
            on
              ? { opacity: 1, clipPath: "inset(0 0 0% 0)", filter: "brightness(1)" }
              : { opacity: 0, clipPath: "inset(0 0 100% 0)", filter: "brightness(0.35)" }
          }
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* paper tooth — static, no motion */}
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
            <h2 className="mt-5 text-3xl tracking-[0.12em] sm:text-4xl">ROYAL RECORDS</h2>
            <div
              className="mx-auto mt-6 h-px w-40"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.3 0.06 60), transparent)",
              }}
            />
            <p className="mt-6 text-sm italic opacity-80 sm:text-base">
              The complete record — experience, education, and every system built.
            </p>

            {/* 3 Concise Verified Facts */}
            <div className="mx-auto my-8 grid max-w-2xl grid-cols-1 gap-4 border-y border-current/15 py-6 sm:grid-cols-3">
              {royalRecordsStats.map((item) => (
                <div key={item.stat} className="space-y-1">
                  <p className="font-display text-lg tracking-[0.14em] uppercase font-semibold">
                    {item.stat}
                  </p>
                  <p className="font-mono text-[0.62rem] tracking-[0.16em] uppercase opacity-75">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <motion.button
                type="button"
                onClick={() => setViewing(true)}
                disabled={viewing}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className={relicButton({ variant: "blood", size: "lg" })}
              >
                <FileText className="h-4 w-4" /> View Resume
              </motion.button>

              <a
                href={profile.resumeUrl}
                download
                className="inline-flex items-center justify-center gap-2 border border-current/40 px-8 py-4 font-display text-xs tracking-[0.28em] uppercase transition-colors duration-500 hover:bg-current/10"
              >
                <Download className="h-4 w-4" /> Download Resume
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <SwordRevealResume open={viewing} onClose={() => setViewing(false)} />
    </SectionShell>
  );
}
