import { useEffect } from "react";
import { ThroneRoomScene } from "@/components/site/hero/ThroneRoomScene";
import { DragonHeroLayer } from "@/components/site/hero/DragonHeroLayer";
import { CinematicIntro } from "@/components/site/hero/CinematicIntro";
import { CinematicSound } from "@/components/site/hero/CinematicSound";
import { HeroContent } from "@/components/site/hero/HeroContent";

/**
 * Hero — thin composition root. Every element of the cinematic opening lives
 * in its own component and is independently controllable:
 *
 *   ThroneRoomScene   environment: throne / firelight / smoke / embers
 *   DragonHeroLayer   isolated slot for the real dragon footage
 *   CinematicIntro    blackout, grain, skip
 *   HeroContent       title sequence → final resting state (with hanging sigil)
 *   CinematicSound    ambience + cues, gated by the sound toggle
 */
export function Hero() {
  // ── Tab-Away Title: "The Realm awaits your return" ──────────────────
  useEffect(() => {
    if (typeof document === "undefined") return;

    let originalTitle = document.title;
    const AWAY_TITLE = "The Realm awaits your return";

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (document.title !== AWAY_TITLE) {
          originalTitle = document.title;
        }
        document.title = AWAY_TITLE;
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (document.title === AWAY_TITLE) {
        document.title = originalTitle;
      }
    };
  }, []);

  return (
    <header
      id="realm"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-24 pb-20 text-center"
    >
      <ThroneRoomScene />
      <DragonHeroLayer />
      <CinematicIntro />
      <HeroContent />
      <CinematicSound />
    </header>
  );
}
