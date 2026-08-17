import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { navigation, profile } from "@/data/portfolio";
import { SoundToggle } from "@/components/site/SoundToggle";
import { useIntro } from "@/components/site/intro-context";
import { useSound } from "@/components/site/sound-context";

import { cn } from "@/lib/utils";

export function Navigation() {
  const { done } = useIntro();
  const { cue } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Hidden: three strikes on the sigil.
  const strikes = useRef(0);
  const strikeTimer = useRef<number | null>(null);
  const [secret, setSecret] = useState(false);

  function onSigil(e: React.MouseEvent) {
    // Stay put when we're already home — a route change would remount and
    // lose the count.
    if (window.location.pathname === "/") e.preventDefault();
    setOpen(false);

    strikes.current += 1;
    if (strikeTimer.current) window.clearTimeout(strikeTimer.current);
    strikeTimer.current = window.setTimeout(() => {
      strikes.current = 0;
    }, 1200);
    if (strikes.current >= 3) {
      strikes.current = 0;
      cue("remembers");
      setSecret(true);
      window.setTimeout(() => setSecret(false), 5400);
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);


  return (
    <>
      <SecretMoment active={secret} />

      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : -18 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: done ? "auto" : "none" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-700",
          scrolled
            ? "border-b border-[color-mix(in_oklab,var(--gold)_16%,transparent)] bg-[color-mix(in_oklab,var(--background)_86%,transparent)] backdrop-blur-md"
            : "border-b-0 border-transparent",
        )}
      >

        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="font-display text-xs tracking-[0.34em] text-gold uppercase"
            onClick={onSigil}
          >
            S<span className="text-muted-foreground">.</span>S
          </Link>


          <ul className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group font-display text-[0.62rem] tracking-[0.26em] text-muted-foreground uppercase transition-colors duration-300 hover:text-gold"
                >
                  {item.label}
                  <span className="block h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <SoundToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:text-gold lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/98 px-8 backdrop-blur-xl lg:hidden"
          >
            <ul className="space-y-6">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border/60 pb-4"
                  >
                    <span className="font-display text-xl tracking-[0.18em] text-gold-gradient uppercase">
                      {item.label}
                    </span>
                    <span className="mt-1 block font-mono text-[0.6rem] tracking-widest text-muted-foreground uppercase">
                      {item.meaning}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-10 font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
              {profile.title}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/**
 * The kingdom remembers — a few seconds of held breath, a raven, one line of
 * text, then nothing. No modal, no state, no explanation.
 */
function SecretMoment({ active }: { active: boolean }) {
  return (
    <>
      <AnimatePresence>
        {active ? (
          <motion.div
            key="veil"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-[55] bg-background/72"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <motion.p
            key="line"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.2, delay: 2, times: [0, 0.18, 0.7, 1] }}
            className="pointer-events-none fixed inset-x-0 top-1/2 z-[61] text-center font-display text-[0.66rem] tracking-[0.46em] text-gold uppercase"
          >
            The kingdom remembers.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </>
  );
}
