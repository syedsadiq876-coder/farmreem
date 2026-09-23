"use client";

import { useEffect, useRef, useState } from "react";

interface HeroH1Props {
  line1: string; // e.g. "Poultry supply,"
  line2: string; // e.g. "built around your"
  line3?: string; // e.g. "kitchen."
  className?: string;
}

export function HeroH1({ line1, line2, line3, className = "" }: HeroH1Props) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Trigger on initial mount so LCP text exists immediately in DOM and begins visual reveal
    setInView(true);
  }, []);

  const fullText = `${line1} ${line2} ${line3 || ""}`.trim();

  const renderLineChars = (text: string, baseIndex: number) => {
    const words = text.split(" ");
    let currentCharIndex = baseIndex;

    return words.map((word, wIdx) => {
      const chars = word.split("");
      return (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {chars.map((char, cIdx) => {
            const idx = currentCharIndex++;
            const delayMs = idx * 35; // 35ms stagger per character

            return (
              <span
                key={cIdx}
                style={{
                  transitionDelay: inView ? `${delayMs}ms` : "0ms",
                }}
                className={`inline-block transition-all duration-600 cubic-bezier(0.16,1,0.3,1) motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!filter-none ${
                  inView
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-3 blur-[2px]"
                }`}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    });
  };

  const line1Len = line1.length;
  const line2Len = line2.length;
  const line3Len = line3 ? line3.length : 0;
  
  const underline2DelayMs = (line1Len + line2Len) * 35 + 100;
  const underline3DelayMs = (line1Len + line2Len + line3Len) * 35 + 100;

  return (
    <h1
      ref={containerRef}
      className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F2E23] leading-[1.05] ${className}`}
    >
      <span className="block space-y-1">
        <span className="block text-[#0F2E23]">{renderLineChars(line1, 0)}</span>
        
        <span className="relative inline-block text-[#C59B27] pb-1 block sm:inline-block">
          <span>{renderLineChars(line2, line1Len)}</span>
          {/* Animated Gold Underline for Line 2 */}
          <span
            aria-hidden="true"
            style={{
              transitionDelay: inView ? `${underline2DelayMs}ms` : "0ms",
            }}
            className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#C59B27]/40 rounded-full origin-left transition-transform duration-700 ease-out motion-reduce:scale-x-100 ${
              inView ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </span>

        {line3 && (
          <span className="relative inline-block text-[#C59B27] pb-1 block sm:inline-block sm:ml-2">
            <span>{renderLineChars(line3, line1Len + line2Len)}</span>
            {/* Animated Gold Underline for Line 3 */}
            <span
              aria-hidden="true"
              style={{
                transitionDelay: inView ? `${underline3DelayMs}ms` : "0ms",
              }}
              className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#C59B27]/40 rounded-full origin-left transition-transform duration-700 ease-out motion-reduce:scale-x-100 ${
                inView ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </span>
        )}
      </span>
    </h1>
  );
}

interface SectionH2Props {
  line1?: string;
  line2?: string;
  text?: string;
  className?: string;
}

export function SectionH2({ line1, line2, text, className = "" }: SectionH2Props) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect(); // Animate ONCE per page visit
          }
        });
      },
      { threshold: 0.25 } // Trigger when ~25% enters viewport
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const fullText = text || `${line1 || ""} ${line2 || ""}`.trim();

  const renderTextChars = (str: string, baseIdx = 0, staggerMs = 25) => {
    const words = str.split(" ");
    let count = baseIdx;

    return words.map((word, wIdx) => {
      const chars = word.split("");
      return (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {chars.map((char, cIdx) => {
            const idx = count++;
            const delay = idx * staggerMs;
            return (
              <span
                key={cIdx}
                style={{
                  transitionDelay: animated ? `${delay}ms` : "0ms",
                }}
                className={`inline-block transition-all duration-500 cubic-bezier(0.16,1,0.3,1) motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!filter-none ${
                  animated
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-2.5 blur-[2px]"
                }`}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <h2
      ref={ref}
      className={`font-extrabold text-[#0F2E23] tracking-tight ${className}`}
    >
      <span className="block">
        {line1 && <span className="block">{renderTextChars(line1, 0, 20)}</span>}
        {line2 && <span className="block">{renderTextChars(line2, line1 ? line1.length : 0, 20)}</span>}
        {!line1 && !line2 && text && renderTextChars(text, 0, 20)}
      </span>
    </h2>
  );
}
