import React from "react";

export function LiveBirdIcon({ className = "w-6 h-6 text-[#C59B27]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16c1.5 0 3-1 3-3 0-1.5-1-2.5-2.5-3 .5-1.5 0-3.5-1.5-4.5-1.5-1-3-1-4 0-.5-.8-1.5-1.5-2.5-1.5-1.5 0-2.5 1-3 2.5C4.5 7 3.5 8 3.5 9.5c0 2 1.5 3.5 3.5 3.5" />
      <path d="M9 13v7" />
      <path d="M14 13v7" />
      <path d="M19 12c1.5 0 2.5-1 2.5-2S20.5 8 19 8" />
      <circle cx="15.5" cy="7.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function WholeChickenIcon({ className = "w-6 h-6 text-[#C59B27]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 14c0 3.5 3 6 7 6s7-2.5 7-6-3.5-5-7-5-7 1.5-7 5z" />
      <path d="M7 11c0-2.5 2-4.5 5-4.5s5 2 5 4.5" />
      <path d="M12 6.5V4.5" />
      <path d="M9.5 5.5l5 0" />
    </svg>
  );
}

export function CutsIcon({ className = "w-6 h-6 text-[#C59B27]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4.5a3.5 3.5 0 0 0-5 0l-5 5a3.5 3.5 0 0 0 5 5l5-5a3.5 3.5 0 0 0 0-5z" />
      <path d="M13.5 10.5l6 6a2 2 0 1 1-3 3l-6-6" />
    </svg>
  );
}

export function BonelessIcon({ className = "w-6 h-6 text-[#C59B27]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14c1 3 4 5 7.5 5 4 0 6.5-2.5 6.5-5.5 0-3.5-3-5.5-7-5.5C9 8 6 10.5 6 14z" />
      <path d="M10 10.5c1.5-1.5 3.5-2 5.5-1.5" />
    </svg>
  );
}

export function ChickenIllustration({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const scale = size === "small" ? "scale-90" : size === "large" ? "scale-110" : "scale-100";
  return (
    <div className={`transition-transform duration-300 ${scale} flex items-center justify-center`}>
      <svg viewBox="0 0 160 160" className="w-28 h-28 text-[#0F2E23]">
        {/* Soft Background Glow */}
        <circle cx="80" cy="80" r="70" fill="#FAF7F2" />
        
        {/* Chicken Body */}
        <path
          d="M95 45 C115 45 130 65 125 90 C120 115 90 125 65 115 C45 105 35 85 45 65 C55 45 75 45 95 45 Z"
          fill="#FFFFFF"
          stroke="#0F2E23"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        
        {/* Wing Detail */}
        <path
          d="M75 70 C90 70 100 82 95 98 C88 108 72 105 68 92 Z"
          fill="#FAF7F2"
          stroke="#0F2E23"
          strokeWidth="2.5"
        />
        
        {/* Head & Neck */}
        <path
          d="M100 50 C110 38 122 42 120 58 C118 68 108 70 100 62 Z"
          fill="#FFFFFF"
          stroke="#0F2E23"
          strokeWidth="3"
        />

        {/* Comb (Red/Gold Accent) */}
        <path
          d="M112 36 C115 30 120 32 121 37 C124 33 128 35 126 41 Z"
          fill="#C59B27"
          stroke="#0F2E23"
          strokeWidth="2"
        />

        {/* Beak */}
        <path
          d="M124 50 L134 54 L123 58 Z"
          fill="#C59B27"
          stroke="#0F2E23"
          strokeWidth="2"
        />

        {/* Wattle */}
        <path
          d="M121 59 C124 64 120 68 117 64 Z"
          fill="#C59B27"
          stroke="#0F2E23"
          strokeWidth="1.5"
        />

        {/* Eye */}
        <circle cx="114" cy="48" r="2.5" fill="#0F2E23" />

        {/* Legs */}
        <path d="M68 115 L64 136 M64 136 L58 140 M64 136 L68 141 M64 136 L64 142" stroke="#0F2E23" strokeWidth="3" strokeLinecap="round" />
        <path d="M88 115 L86 136 M86 136 L80 140 M86 136 L90 141 M86 136 L86 142" stroke="#0F2E23" strokeWidth="3" strokeLinecap="round" />

        {/* Size Badge Text Accent */}
        <g opacity="0.85">
          <rect x="24" y="24" width="48" height="22" rx="11" fill="#0F2E23" />
          <text x="48" y="39" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            {size.toUpperCase()}
          </text>
        </g>
      </svg>
    </div>
  );
}
