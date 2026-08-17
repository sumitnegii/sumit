import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Ambient sound architecture.
 *
 * The site works perfectly with sound disabled — nothing autoplays.
 * To add real ambience later, drop files in /public/audio and list them in
 * AMBIENT_TRACKS (fire crackle, wind, distant dragon, metal ambience).
 */
const AMBIENT_TRACKS: string[] = [
  // "/audio/fire-crackle.mp3",
  // "/audio/wind.mp3",
];

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  /** Fire a one-shot cue (transitions, hovers). No-op until assets exist. */
  cue: (name: string) => void;
};

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  cue: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const elements = useRef<HTMLAudioElement[]>([]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        if (next && elements.current.length === 0) {
          elements.current = AMBIENT_TRACKS.map((src) => {
            const audio = new Audio(src);
            audio.loop = true;
            audio.volume = 0.25;
            return audio;
          });
        }
        elements.current.forEach((audio) => {
          if (next) void audio.play().catch(() => {});
          else audio.pause();
        });
      }
      return next;
    });
  }, []);

  const cue = useCallback(
    (_name: string) => {
      if (!enabled) return;
      // Placeholder for one-shot cinematic cues.
    },
    [enabled],
  );

  const value = useMemo(() => ({ enabled, toggle, cue }), [enabled, toggle, cue]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
