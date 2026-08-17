import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/site/sound-context";

/**
 * Sound control. Ambience is OFF by default and never autoplays.
 * Audio sources are wired in sound-context.tsx (placeholder-safe).
 */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute ambience" : "Enable ambience"}
      title={enabled ? "Mute ambience" : "Enable ambience"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--gold)_55%,transparent)] hover:text-gold ${className ?? ""}`}
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
