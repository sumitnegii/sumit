import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import sky from "@/assets/raven-sky.jpg";
import clouds from "@/assets/raven-clouds.png";
import ravenFlightSheet from "@/assets/raven-flight-sheet.png";

export const RAVEN_CINEMATIC_MS = 5400;

/**
 * Preload all cinematic background and animated raven assets
 * the moment the Ravenry enters the viewport.
 */
export function preloadRavenScene() {
  [sky, clouds, ravenFlightSheet].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

// Anatomical wing sequences
// Downstroke: High crest -> power push -> cupped bottom
const DOWNSTROKE_FRAMES = [0, 1, 2, 3, 5];
// Upstroke recovery: Cupped bottom -> wrist fold -> low lift -> mid lift -> high lift -> crest
const UPSTROKE_FRAMES = [5, 6, 7, 8, 9, 10, 0];
const GLIDE_FRAME = 11;
const GLIDE_FLEX_FRAME = 4;

const FRAME_W = 560;
const FRAME_H = 420;
const COLS = 4;

/**
 * Maps a flap cycle phase (0..1) to an exact sub-frame blend pair
 * with biological downstroke/upstroke velocity curves.
 */
function getFlapPose(phase: number): { frameA: number; frameB: number; alpha: number; lift: number; pitch: number } {
  // Downstroke: 0.00 -> 0.38 (Fast, powerful stroke)
  if (phase < 0.38) {
    const s = phase / 0.38;
    // Power acceleration: stroke accelerates through air
    const curve = Math.pow(s, 1.25);
    const pos = curve * (DOWNSTROKE_FRAMES.length - 1);
    const i = Math.floor(pos);
    const nextI = Math.min(i + 1, DOWNSTROKE_FRAMES.length - 1);
    const alpha = pos - i;
    const lift = Math.sin(s * Math.PI) * 1.0; // Peak upward lift
    const pitch = 1.4 * Math.sin(s * Math.PI); // Nose pitches slightly up on power thrust
    return {
      frameA: DOWNSTROKE_FRAMES[i]!,
      frameB: DOWNSTROKE_FRAMES[nextI]!,
      alpha,
      lift,
      pitch,
    };
  }

  // Bottom hold & compression: 0.38 -> 0.44
  if (phase < 0.44) {
    const s = (phase - 0.38) / 0.06;
    return {
      frameA: 5,
      frameB: 6,
      alpha: s * 0.5,
      lift: 0.8 * (1 - s),
      pitch: 0.5 * (1 - s),
    };
  }

  // Upstroke recovery: 0.44 -> 1.00 (Wrist folds, wings lift smoothly)
  const s = (phase - 0.44) / 0.56;
  // Wrist flexion ease-out
  const curve = 1 - Math.pow(1 - s, 1.15);
  const pos = curve * (UPSTROKE_FRAMES.length - 1);
  const i = Math.floor(pos);
  const nextI = Math.min(i + 1, UPSTROKE_FRAMES.length - 1);
  const alpha = pos - i;
  const lift = -0.6 * Math.sin(s * Math.PI); // Body sinks slightly during recovery
  const pitch = -1.6 * Math.sin(s * Math.PI); // Nose pitches slightly down to streamline
  return {
    frameA: UPSTROKE_FRAMES[i]!,
    frameB: UPSTROKE_FRAMES[nextI]!,
    alpha,
    lift,
    pitch,
  };
}

/**
 * RavenCinematic
 *
 * An authentic cinematic shot of a common raven (Corvus corax) traversing
 * a vast mountain landscape. Powered by an aligned 12-pose anatomical flight cycle
 * with 60fps sub-frame blending, natural wing physics (downstroke thrust, upstroke recovery,
 * intermittent glides), dynamic body reaction forces, and atmospheric perspective depth.
 */
export function RavenCinematic({ active, onDone }: { active: boolean; onDone?: () => void }) {
  const reduced = useReducedMotion();
  const done = useRef(onDone);
  done.current = onDone;

  const veil = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const cloudFar = useRef<HTMLDivElement>(null);
  const cloudMid = useRef<HTMLDivElement>(null);
  const cloudNear = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      const t = window.setTimeout(() => done.current?.(), 700);
      return () => window.clearTimeout(t);
    }

    // Load sprite sheet
    const sheetImg = new Image();
    sheetImg.src = ravenFlightSheet;

    let raf = 0;
    const start = performance.now();
    let flapPhase = 0; // 0..1 in flapping cycle
    let last = start;

    const tick = (now: number) => {
      const ms = now - start;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // ── the world leaves, and comes back ──────────────────────────────
      const veilIn = easeInOut(seg(ms, 0, 800));
      const veilOut = 1 - easeInOut(seg(ms, 5000, 5400));
      if (veil.current) veil.current.style.opacity = String(Math.min(veilIn, veilOut));

      // landscape lives inside the veil: up by ~1300ms, gone by 5250ms
      const sceneOp = easeInOut(seg(ms, 620, 1300)) * (1 - easeInOut(seg(ms, 4750, 5250)));
      if (scene.current) scene.current.style.opacity = String(sceneOp);

      // ── camera: barely-there push-in and drift ────────────────────────
      const c = clamp01(ms / 5400);
      if (camera.current) {
        camera.current.style.transform = `scale(${lerp(1.0, 1.045, easeInOut(c))}) translate3d(${lerp(0.6, -0.8, c)}%, ${lerp(0.3, -0.4, c)}%, 0)`;
      }

      // ── clouds: three depths, three speeds ────────────────────────────
      const s = ms / 1000;
      if (cloudFar.current) cloudFar.current.style.transform = `translate3d(${-s * 0.55}%, 0, 0)`;
      if (cloudMid.current) cloudMid.current.style.transform = `translate3d(${-s * 1.15}%, ${-s * 0.06}%, 0)`;
      if (cloudNear.current) cloudNear.current.style.transform = `translate3d(${-s * 0.28}%, 0, 0)`;

      // ── the raven flight physics & trajectory ─────────────────────────
      // Flight active from 1100ms to 4800ms (3.7s flight)
      const t = clamp01((ms - 1100) / 3700);

      if (t > 0 && t < 1) {
        // Natural 3D curved flight path crossing the valley toward the horizon
        // Starts far left -> curves forward across midground -> banks toward pass -> recedes into distance
        const x = lerp(16, 94, easeInOut(t)) + Math.sin(t * Math.PI) * 4.8;
        const y = 54 - 28 * Math.pow(t, 1.3) - Math.sin(t * Math.PI) * 3.6;

        // Depth perspective scale: 0.18 -> 0.38 -> 0.28 -> 0.12 -> 0.035
        const scale =
          t < 0.35
            ? lerp(0.18, 0.38, easeInOut(t / 0.35))
            : t < 0.65
              ? lerp(0.38, 0.26, easeInOut((t - 0.35) / 0.3))
              : lerp(0.26, 0.035, Math.pow((t - 0.65) / 0.35, 1.35));

        // Natural wingbeat rhythm: FLAP FLAP GLIDE FLAP FLAP GLIDE
        // Authentic raven cadence: bursts of 2 powerful wingbeats followed by soaring glides
        const isGlide1 = t >= 0.24 && t <= 0.44;
        const isGlide2 = t >= 0.70 && t <= 0.86;
        const isGliding = isGlide1 || isGlide2;

        // Large corvid wingbeat frequency: ~2.85 wingbeats per second during active flaps
        const flapHz = isGliding ? 0 : lerp(3.0, 2.7, t);
        flapPhase = (flapPhase + dt * flapHz) % 1.0;

        let frameA = GLIDE_FRAME;
        let frameB = GLIDE_FRAME;
        let blendAlpha = 0;
        let liftForce = 0;
        let bodyPitch = 0;

        if (isGliding) {
          // Glide state: wings locked in majestic extended span with subtle aerodynamic flex
          const glideProgress = isGlide1 ? (t - 0.24) / 0.20 : (t - 0.70) / 0.16;
          const glideFlex = Math.sin(glideProgress * Math.PI * 2) * 0.5 + 0.5;
          frameA = GLIDE_FRAME;
          frameB = GLIDE_FLEX_FRAME;
          blendAlpha = glideFlex * 0.25; // Subtle natural feather breathing during glide
          liftForce = Math.sin(glideProgress * Math.PI) * 0.25; // Gentle atmospheric thermal float
          bodyPitch = -0.6; // Streamlined cruising pitch
        } else {
          // Flapping state: authentic biological downstroke/upstroke mechanics
          const pose = getFlapPose(flapPhase);
          frameA = pose.frameA;
          frameB = pose.frameB;
          blendAlpha = pose.alpha;
          liftForce = pose.lift;
          bodyPitch = pose.pitch;
        }

        // Body reaction physics:
        // Downstroke exerts upward lift on the torso; upstroke recovery allows torso to dip slightly
        const bodyBob = liftForce * 3.6;

        // Natural banking into the curved flight path (3 to 10 degrees)
        const bankCurve = Math.sin(t * Math.PI) * 5.5;
        const bank = lerp(-2.0, -8.0, easeInOut(t)) - bankCurve + bodyPitch;

        // Atmospheric perspective: contrast & haze adjust with distance
        // Emerges naturally from haze, remains crisp in midground, dissolves smoothly into distant mountain pass
        const fade = t < 0.10 ? easeInOut(t / 0.10) : t > 0.86 ? Math.max(0, 1 - (t - 0.86) / 0.14) : 1;
        const atmosphericBrightness = lerp(0.88, 0.65, t);
        const atmosphericContrast = lerp(1.12, 0.84, t);
        const atmosphericSaturate = lerp(0.85, 0.48, t);

        if (rig.current) {
          rig.current.style.opacity = String(fade * 0.98);
          rig.current.style.transform = `translate3d(${x}vw, ${y - bodyBob * 0.12}vh, 0) scale(${scale}) rotate(${bank}deg)`;
          rig.current.style.filter = `brightness(${atmosphericBrightness}) contrast(${atmosphericContrast}) saturate(${atmosphericSaturate})`;
        }

        // ── Canvas sub-frame alpha blending ─────────────────────────────
        const canvas = canvasRef.current;
        if (canvas && sheetImg.complete && sheetImg.naturalWidth > 0) {
          const ctx = canvas.getContext("2d", { alpha: true });
          if (ctx) {
            ctx.clearRect(0, 0, FRAME_W, FRAME_H);

            // Draw base frame A (solid opacity)
            const colA = frameA % COLS;
            const rowA = Math.floor(frameA / COLS);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(
              sheetImg,
              colA * FRAME_W,
              rowA * FRAME_H,
              FRAME_W,
              FRAME_H,
              0,
              0,
              FRAME_W,
              FRAME_H,
            );

            // Overlay blended frame B for buttery 60fps interpolation with zero holes
            if (blendAlpha > 0.005 && frameA !== frameB) {
              const colB = frameB % COLS;
              const rowB = Math.floor(frameB / COLS);
              ctx.globalAlpha = blendAlpha;
              ctx.drawImage(
                sheetImg,
                colB * FRAME_W,
                rowB * FRAME_H,
                FRAME_W,
                FRAME_H,
                0,
                0,
                FRAME_W,
                FRAME_H,
              );
            }
          }
        }
      } else if (rig.current) {
        rig.current.style.opacity = "0";
      }

      if (ms < 5400) raf = requestAnimationFrame(tick);
      else done.current?.();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  if (!active || reduced) return null;

  return (
    <div
      aria-hidden
      data-raven-flight
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      {/* the veil the portfolio disappears behind */}
      <div ref={veil} className="absolute inset-0 bg-[oklch(0.05_0.004_60)]" style={{ opacity: 0 }}>
        {/* the world */}
        <div ref={scene} className="absolute inset-0" style={{ opacity: 0 }}>
          <div ref={camera} className="absolute inset-[-3%] will-change-transform">
            <img
              src={sky}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(0.78) brightness(0.82)" }}
            />

            {/* far clouds — very slow, low contrast */}
            <div
              ref={cloudFar}
              className="absolute top-[6%] -left-[60%] h-[38%] w-[220%] will-change-transform"
              style={{
                backgroundImage: `url(${clouds})`,
                backgroundRepeat: "repeat-x",
                backgroundSize: "auto 100%",
                opacity: 0.2,
                filter: "brightness(0.6) saturate(0.5)",
              }}
            />
            {/* mid clouds */}
            <div
              ref={cloudMid}
              className="absolute top-[18%] -left-[80%] h-[30%] w-[260%] will-change-transform"
              style={{
                backgroundImage: `url(${clouds})`,
                backgroundRepeat: "repeat-x",
                backgroundSize: "auto 100%",
                opacity: 0.28,
                filter: "brightness(0.75) saturate(0.6)",
              }}
            />
            {/* near mist sitting in the valley — almost stationary */}
            <div
              ref={cloudNear}
              className="absolute top-[46%] -left-[40%] h-[26%] w-[200%] will-change-transform"
              style={{
                backgroundImage: `url(${clouds})`,
                backgroundRepeat: "repeat-x",
                backgroundSize: "auto 100%",
                opacity: 0.16,
                filter: "brightness(1.05) saturate(0.35) blur(2px)",
              }}
            />

            {/* atmospheric perspective: haze at the horizon, weight up top */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.09 0.01 60 / 0.72) 0%, oklch(0.12 0.012 60 / 0.18) 34%, oklch(0.55 0.05 70 / 0.10) 52%, oklch(0.06 0.006 60 / 0.55) 100%)",
              }}
            />
            {/* cinematic vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 48%, transparent 42%, oklch(0.04 0.004 60 / 0.68) 100%)",
              }}
            />
          </div>

          {/* the raven */}
          <div
            ref={rig}
            className="absolute top-0 left-0 will-change-transform"
            style={{
              opacity: 0,
              transformOrigin: "50% 50%",
              width: `${FRAME_W}px`,
              height: `${FRAME_H}px`,
            }}
          >
            <canvas
              ref={canvasRef}
              width={FRAME_W}
              height={FRAME_H}
              className="block h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
