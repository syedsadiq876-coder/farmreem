"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export interface CarouselSlide {
  src: string;
  alt: string;
  captionTitle?: string;
  captionSub?: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  aspectRatio?: string; // e.g. "h-[420px] sm:h-[480px] lg:h-[520px]"
  autoPlayInterval?: number; // ms, default 4500
  className?: string;
  overlayChildren?: React.ReactNode;
  showDots?: boolean;
  dotsPosition?: "bottom-4" | "top-4";
}

export default function ImageCarousel({
  slides,
  aspectRatio = "h-[420px] sm:h-[480px] lg:h-[520px]",
  autoPlayInterval = 4500,
  className = "",
  overlayChildren,
  showDots = true,
  dotsPosition = "bottom-4",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Check prefers-reduced-motion safely on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Next slide navigation
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay Effect
  useEffect(() => {
    if (isHovered || isReducedMotion || slides.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, isReducedMotion, autoPlayInterval, goToNext, slides.length]);

  // Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Image Carousel"
      className={`relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8E1D3] group focus:outline-none focus:ring-2 focus:ring-[#C59B27] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      <div className={`relative w-full ${aspectRatio} bg-[#0F2E23]`}>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.src + "-" + index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E23]/80 via-transparent to-transparent" />

              {(slide.captionTitle || slide.captionSub) && (
                <div className="absolute bottom-12 left-6 right-6 text-white space-y-1 z-20">
                  {slide.captionTitle && (
                    <span className="text-xs font-extrabold uppercase tracking-wider bg-[#C59B27] text-[#0F2E23] px-2.5 py-1 rounded inline-block shadow">
                      {slide.captionTitle}
                    </span>
                  )}
                  {slide.captionSub && (
                    <p className="text-sm font-medium text-white/95 drop-shadow-md">
                      {slide.captionSub}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Stationary Overlay Elements (e.g. Order Card or Step Bar) */}
        {overlayChildren && (
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end">
            <div className="pointer-events-auto">
              {overlayChildren}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Dots */}
      {showDots && slides.length > 1 && (
        <div className={`absolute ${dotsPosition} left-0 right-0 z-40 flex items-center justify-center gap-2 pointer-events-auto`}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                idx === currentIndex
                  ? "w-7 bg-[#C59B27]"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
