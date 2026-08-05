"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export default function HeroBanner({ className }: { className?: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, slide: 0 });

  const slides = [
    { src: "/images/hero.png", alt: "Kiosk Promo 1" },
    { src: "/images/hero2.png", alt: "Kiosk Promo 2" },
  ];

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.src;
    });
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % 2);
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    
    setIsDragging(true);
    setCurrentSlide(prev => {
      // Calculate current slide based on drag start
      return currentSlide;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    // We'll handle drag by updating a drag offset state
  };

  const handleMouseUp = () => {
    if (isDragging) {
      // Snap to nearest slide on release
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg my-4 aspect-[16/9] ${className ?? ""}`}>
      <div
        className="relative w-full h-full flex"
        style={{ transform: `translateX(-${100 * currentSlide}%)`, transition: "transform 500ms ease-out" }}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
        }}
        onMouseUp={() => {}}
        onMouseLeave={() => {}}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-full flex-shrink-0"
            style={{ minWidth: "100%" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover rounded-2xl"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 500);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-[#FFA600] w-3"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}