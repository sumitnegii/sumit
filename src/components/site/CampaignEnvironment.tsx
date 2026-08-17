import { useReducedMotion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";

type EnvKind = "war-room" | "library" | "beacons" | "ravenry" | "forge";

const ENV_BY_SLUG: Record<string, EnvKind> = {
  "talentflow-ai": "war-room",
  "bnova-kitabai": "library",
  crowdsolve: "beacons",
  "lead-distribution": "ravenry",
  "ecommerce-backend": "forge",
};

/**
 * CampaignEnvironment — each campaign image is a place, and places are never
 * completely still. One or two light sources per environment, moving on their
 * own irregular clock. Nothing here reads as a "web effect": no particles,
 * no glow rings — only light behaving like light.
 *
 * Disabled entirely on touch devices and under reduced motion.
 */
export function CampaignEnvironment({ slug, live }: { slug: string; live: boolean }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const kind = ENV_BY_SLUG[slug] ?? "forge";

  if (reduced || isMobile) return null;

  const paused = live ? "running" : "paused";

  const sources: Record<EnvKind, { light: string; pos: string; period: string; mist?: string }> = {
    "war-room": {
      light:
        "radial-gradient(38% 44% at 50% 78%, color-mix(in oklab, var(--ember) 34%, transparent), transparent 72%)",
      pos: "inset-0",
      period: "5.3s",
      mist: "linear-gradient(90deg, transparent, oklch(0.5 0.02 60 / 0.07), transparent)",
    },
    library: {
      light:
        "radial-gradient(30% 52% at 22% 60%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)",
      pos: "inset-0",
      period: "6.7s",
      mist: "linear-gradient(120deg, transparent, oklch(0.72 0.05 80 / 0.06), transparent)",
    },
    beacons: {
      light:
        "radial-gradient(26% 30% at 76% 34%, color-mix(in oklab, var(--ember) 26%, transparent), transparent 74%)",
      pos: "inset-0",
      period: "7.9s",
      mist: "linear-gradient(90deg, transparent, oklch(0.55 0.01 250 / 0.09), transparent)",
    },
    ravenry: {
      light:
        "radial-gradient(34% 40% at 62% 22%, oklch(0.78 0.04 250 / 0.16), transparent 72%)",
      pos: "inset-0",
      period: "9.4s",
      mist: "linear-gradient(90deg, transparent, oklch(0.6 0.02 250 / 0.08), transparent)",
    },
    forge: {
      light:
        "radial-gradient(30% 34% at 40% 82%, color-mix(in oklab, var(--ember) 38%, transparent), transparent 70%)",
      pos: "inset-0",
      period: "4.6s",
    },
  };

  const env = sources[kind];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute ${env.pos} mix-blend-screen`}
        style={{
          background: env.light,
          animation: `campaign-flame ${env.period} ease-in-out infinite`,
          animationPlayState: paused,
        }}
      />
      {env.mist ? (
        <div
          className="absolute -inset-x-8 inset-y-0"
          style={{
            background: env.mist,
            animation: "campaign-mist 26s ease-in-out infinite alternate",
            animationPlayState: paused,
          }}
        />
      ) : null}
    </div>
  );
}
