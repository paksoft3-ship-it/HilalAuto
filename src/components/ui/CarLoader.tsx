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

        {/* Car */}
        <g className="og-car">
          {/* cabin */}
          <path
            d="M38 36 L44 24 Q45.5 22 48 22 L74 22 Q77 22 78.8 24.4 L87 36 Z"
            fill="currentColor"
            opacity="0.85"
          />
          {/* windows */}
          <path d="M46 34.5 L50.5 25 L60 25 L60 34.5 Z" fill="white" opacity="0.55" />
          <path d="M63.5 34.5 L63.5 25 L73.5 25 Q74.8 25 75.6 26.1 L81.5 34.5 Z" fill="white" opacity="0.55" />
          {/* body */}
          <rect x="24" y="34" width="76" height="13.5" rx="5" fill="currentColor" />
          {/* headlight */}
          <rect x="95.5" y="37" width="4" height="3.4" rx="1.5" fill="#FFD066" />
          {/* tail light */}
          <rect x="24.5" y="37" width="3" height="3.4" rx="1.4" fill="#FF6B5E" />

          {/* rear wheel */}
          <g className="og-wheel">
            <circle cx="40" cy="48.5" r="7.2" fill="#1E232B" />
            <rect x="34.4" y="47.6" width="11.2" height="1.8" rx="0.9" fill="#4B5563" />
            <rect x="39.1" y="42.9" width="1.8" height="11.2" rx="0.9" fill="#4B5563" />
            <circle cx="40" cy="48.5" r="2.1" fill="white" />
          </g>
          {/* front wheel */}
          <g className="og-wheel">
            <circle cx="86" cy="48.5" r="7.2" fill="#1E232B" />
            <rect x="80.4" y="47.6" width="11.2" height="1.8" rx="0.9" fill="#4B5563" />
            <rect x="85.1" y="42.9" width="1.8" height="11.2" rx="0.9" fill="#4B5563" />
            <circle cx="86" cy="48.5" r="2.1" fill="white" />
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
