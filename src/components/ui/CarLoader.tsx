import { cn } from "@/lib/utils";

interface CarLoaderProps {
  label?: string;
  className?: string;
  /** Height of the SVG in px; width scales proportionally. */
  size?: number;
}

/**
 * Brand loading animation: a car driving over a moving dashed road with
 * spinning wheels and speed lines. Pure SVG + CSS, no dependencies.
 */
export function CarLoader({ label, className, size = 64 }: CarLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-12", className)} role="status" aria-live="polite">
      <style>{`
        @keyframes og-drive { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        @keyframes og-wheel { to { transform: rotate(360deg); } }
        @keyframes og-road { to { stroke-dashoffset: -28; } }
        @keyframes og-speed {
          0%   { opacity: 0; transform: translateX(8px); }
          30%  { opacity: .6; }
          100% { opacity: 0; transform: translateX(-16px); }
        }
        .og-car { animation: og-drive 1.1s ease-in-out infinite; }
        .og-wheel { animation: og-wheel .7s linear infinite; transform-box: fill-box; transform-origin: center; }
        .og-road { animation: og-road .55s linear infinite; }
        .og-speed-line { animation: og-speed 1s ease-out infinite; }
        .og-speed-line:nth-child(2) { animation-delay: .25s; }
        .og-speed-line:nth-child(3) { animation-delay: .5s; }
        @media (prefers-reduced-motion: reduce) {
          .og-car, .og-wheel, .og-road, .og-speed-line { animation: none; }
          .og-speed-line { opacity: .4; }
        }
      `}</style>

      <svg
        width={(size * 120) / 64}
        height={size}
        viewBox="0 0 120 64"
        fill="none"
        aria-hidden="true"
        className="text-primary"
      >
        {/* Speed lines */}
        <g fill="currentColor">
          <rect className="og-speed-line" x="4" y="26" width="14" height="2.5" rx="1.25" />
          <rect className="og-speed-line" x="0" y="33" width="18" height="2.5" rx="1.25" />
          <rect className="og-speed-line" x="6" y="40" width="11" height="2.5" rx="1.25" />
        </g>

        {/* Sports car — low fastback silhouette with rear spoiler */}
        <g className="og-car">
          {/* rear spoiler */}
          <rect x="10.5" y="30.6" width="13.5" height="2.8" rx="1.4" fill="currentColor" />
          <rect x="15.5" y="33" width="2.6" height="4.5" rx="1" fill="currentColor" opacity="0.8" />

          {/* body: one low wedge from tail to nose */}
          <path
            d="M12 47
               L12 41
               Q12 37.4 16.5 36.6
               L32 34.8
               L45.5 25.8
               Q47.5 24.4 50.5 24.4
               L62 24.4
               Q65.5 24.4 68.5 26.4
               L80 33
               L98 34.8
               Q105.5 35.8 106.8 39.4
               L106.8 43.4
               Q106.8 47 102.5 47
               Z"
            fill="currentColor"
          />

          {/* glass: fastback rear window + raked windshield */}
          <path d="M40.5 33.6 L48.5 28 L54.5 27 L54.5 33.6 Z" fill="white" opacity="0.55" />
          <path d="M58 33.6 L58 27 L62.5 27 Q65.2 27 67.4 28.5 L75.5 33.6 Z" fill="white" opacity="0.55" />

          {/* side vent + sill accent */}
          <rect x="80" y="38.6" width="7" height="2" rx="1" fill="white" opacity="0.35" />
          <rect x="26" y="44" width="58" height="1.6" rx="0.8" fill="white" opacity="0.22" />

          {/* sleek headlight slit + tail light strip */}
          <rect x="98.5" y="36.6" width="7" height="2.4" rx="1.2" fill="#FFD066" />
          <rect x="12.4" y="38" width="2.8" height="4.6" rx="1.2" fill="#FF6B5E" />

          {/* rear wheel */}
          <g className="og-wheel">
            <circle cx="34" cy="48.5" r="7.4" fill="#1E232B" />
            <rect x="28.2" y="47.6" width="11.6" height="1.8" rx="0.9" fill="#4B5563" />
            <rect x="33.1" y="42.7" width="1.8" height="11.6" rx="0.9" fill="#4B5563" />
            <circle cx="34" cy="48.5" r="2.1" fill="white" />
          </g>
          {/* front wheel */}
          <g className="og-wheel">
            <circle cx="90" cy="48.5" r="7.4" fill="#1E232B" />
            <rect x="84.2" y="47.6" width="11.6" height="1.8" rx="0.9" fill="#4B5563" />
            <rect x="89.1" y="42.7" width="1.8" height="11.6" rx="0.9" fill="#4B5563" />
            <circle cx="90" cy="48.5" r="2.1" fill="white" />
          </g>
        </g>

        {/* Road */}
        <line
          className="og-road"
          x1="0" y1="59.5" x2="120" y2="59.5"
          stroke="currentColor" strokeOpacity="0.35"
          strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 14"
        />
      </svg>

      {label && <span className="text-[13px] text-muted-text">{label}</span>}
    </div>
  );
}
