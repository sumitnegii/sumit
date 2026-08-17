import { useState } from "react";
import royalSealImg from "@/assets/royal-seal.png";

/**
 * RoyalSealStamp — Standalone Dark Burgundy Wax Seal Signature.
 *
 * Sits directly on the background without any card or large rectangular container:
 * - Handcrafted dark aged red/burgundy wax
 * - Deeply embossed SS monogram in the center
 * - Slight natural organic rotation
 * - Restrained specular catch on hover
 */
export function RoyalSealStamp({ size = 58 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="img"
      aria-label="Royal Record Wax Seal Signature"
      className="relative shrink-0 select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Subtle dark ambient shadow beneath the wax stamp */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-black/70 blur-sm translate-y-0.5 scale-90"
      />

      <div
        className="relative transition-transform duration-500 ease-out"
        style={{
          width: size,
          height: size,
          transform: hovered ? "rotate(-1deg) scale(1.05)" : "rotate(-3.5deg) scale(1)",
        }}
      >
        <img
          src={royalSealImg}
          alt="SS Wax Seal"
          width={400}
          height={400}
          className="h-full w-full object-contain filter transition-all duration-500"
          style={{
            filter: hovered
              ? "brightness(1.16) contrast(1.15) drop-shadow(0 4px 14px rgba(130, 25, 35, 0.45))"
              : "brightness(0.95) contrast(1.1) drop-shadow(0 3px 10px rgba(0,0,0,0.85))",
          }}
        />

        {/* Very subtle specular candlelight reflection on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background:
              "radial-gradient(ellipse 45% 35% at 38% 32%, rgba(255, 230, 200, 0.22) 0%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      </div>
    </div>
  );
}
