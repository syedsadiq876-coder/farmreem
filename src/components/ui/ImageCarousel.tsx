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
  aspectRatio?: string; // e.g. "aspect-[16/9]" or "h-[450px]"
  autoPlayInterval?: number; // ms, default 4500
  className?: string;
}

export default function ImageCarousel({
  slides,
  aspectRatio = "h-[420px] sm:h-[480px] lg:h-[520px]",
  autoPlayInterval = 4500,
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Detect reduced motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Next Slide helper
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Previous Slide helper
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || prefersReducedMotion || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, autoPlayInterval, nextSlide, slides.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <div
      ref={carouselRef}
      tabIndex={0}
      role="region"
      aria-label="Image Carousel"
      className={`relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8E1D3] group focus:outline-none focus:ring-2 focus:ring-[#C59B27] ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      {/* Container for slides */}
      <div className={`relative w-full ${aspectRatio} bg-[#0F2E23]`}>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.src + index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
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

              {/* Optional Slide Caption Overlay */}
              {(slide.captionTitle || slide.captionSub) && (
                <div className="absolute bottom-10 left-6 right-6 text-white space-y-1 z-20">
                  {slide.captionTitle && (
                    <span className="text-xs font-extrabold uppercase tracking-wider bg-[#C59B27] text-[#0F2E23] px-2.5 py-1 rounded inline-block">
                      {slide.captionTitle}
                    </span>
                  )}
                  {slide.captionSub && (
                    <p className="text-sm font-medium text-white/90 drop-shadow-md">
                      {slide.captionSub}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Elegant Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2">
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
