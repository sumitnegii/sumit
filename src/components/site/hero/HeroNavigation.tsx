import { Navigation } from "@/components/site/Navigation";

/**
 * HeroNavigation — the site navigation as the hero's cinematic timeline sees
 * it: hidden for the whole intro, then quietly settling into place once the
 * title and CTAs have arrived. The reveal itself lives in <Navigation>, which
 * reads the intro's `done` flag.
 */
export function HeroNavigation() {
  return <Navigation />;
}
