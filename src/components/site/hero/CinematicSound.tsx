import { useEffect, useRef } from "react";
import { useSound } from "@/components/site/sound-context";
import { useIntro } from "@/components/site/intro-context";

/**
 * CinematicSound — the hero's audio bed and cue track.
 *
 * Nothing ever autoplays: the existing sound toggle is the single gate, and
 * browsers that block playback simply stay silent. Ambience is layered and
 * quiet — room tone, distant wind, fire, a very low rumble — never music.
 *
 * ADDING AUDIO LATER: drop files in /public/audio with these names, or edit
 * the map below. Missing files fail silently.
 */
const BED = [
  { src: "/audio/room-tone.mp3", volume: 0.16 },
  { src: "/audio/wind-distant.mp3", volume: 0.1 },
  { src: "/audio/fire-low.mp3", volume: 0.14 },
  { src: "/audio/rumble.mp3", volume: 0.08 },
];

/** One-shot cues, fired on intro phases. */
const CUES: Record<number, { src: string; volume: number }> = {
  2: { src: "/audio/cue-reveal.mp3", volume: 0.2 },
  3: { src: "/audio/dragon-distant.mp3", volume: 0.22 },
  5: { src: "/audio/cue-title.mp3", volume: 0.16 },
};

export function CinematicSound() {
  const { enabled } = useSound();
  const { phase } = useIntro();
  const bed = useRef<HTMLAudioElement[]>([]);
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) {
      bed.current.forEach((a) => a.pause());
      return;
    }
    if (bed.current.length === 0) {
      bed.current = BED.map(({ src, volume }) => {
        const a = new Audio(src);
        a.loop = true;
        a.volume = volume;
        return a;
      });
    }
    bed.current.forEach((a) => void a.play().catch(() => {}));
    return () => bed.current.forEach((a) => a.pause());
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const cue = CUES[phase];
    if (!cue || fired.current.has(phase)) return;
    fired.current.add(phase);
    const a = new Audio(cue.src);
    a.volume = cue.volume;
    void a.play().catch(() => {});
  }, [enabled, phase]);

  return null;
}
