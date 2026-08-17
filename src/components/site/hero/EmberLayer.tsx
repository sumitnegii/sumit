import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * EmberLayer — a handful of real embers, drawn on a canvas.
 *
 * Deliberately sparse: most of the frame stays empty. Each ember has its own
 * size, rise speed, lateral sway and life, occasionally brightening before it
 * cools and vanishes. One canvas keeps this off the DOM and cheap.
 */
type Ember = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  swaySpeed: number;
  life: number;
  maxLife: number;
  heat: number;
};

export function EmberLayer({ count }: { count?: number }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLCanvasElement | null>(null);

  const total = count ?? (isMobile ? 7 : 12);

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const spawn = (initial = false): Ember => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + Math.random() * 40,
      r: 0.6 + Math.random() * 1.8,
      vy: 4 + Math.random() * 14,
      sway: 6 + Math.random() * 22,
      swaySpeed: 0.2 + Math.random() * 0.5,
      life: 0,
      maxLife: 9 + Math.random() * 12,
      heat: 0.35 + Math.random() * 0.5,
    });

    let embers = Array.from({ length: total }, () => spawn(true));
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      embers = embers.map((e) => {
        e.life += dt;
        e.y -= e.vy * dt;
        const drift = Math.sin(e.life * e.swaySpeed) * e.sway;
        if (e.life > e.maxLife || e.y < -20) return spawn();

        const fadeIn = Math.min(1, e.life / 1.2);
        const fadeOut = Math.min(1, (e.maxLife - e.life) / 2.5);
        // occasional brightening as it catches air
        const pulse = 0.75 + Math.abs(Math.sin(e.life * 1.7)) * 0.45;
        const a = e.heat * fadeIn * fadeOut * pulse;

        const x = e.x + drift;
        const grad = ctx.createRadialGradient(x, e.y, 0, x, e.y, e.r * 5);
        grad.addColorStop(0, `rgba(255, 196, 120, ${a})`);
        grad.addColorStop(0.35, `rgba(226, 122, 44, ${a * 0.45})`);
        grad.addColorStop(1, "rgba(180, 70, 20, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, e.y, e.r * 5, 0, Math.PI * 2);
        ctx.fill();
        return e;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, total]);

  if (reduced) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 4, mixBlendMode: "screen", opacity: 0.85 }}
    />
  );
}
