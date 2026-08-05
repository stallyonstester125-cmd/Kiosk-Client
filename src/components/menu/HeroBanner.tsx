"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export default function HeroBanner({ className }: { className?: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, slide: 0, offset: 0 });
  const autoSlideTimerRef = useRef<number | undefined>(undefined);

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
    autoSlideTimerRef.current = window.setInterval(() => {
      if (!isDragging) {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 5000);

    return () => {
      if (autoSlideTimerRef.current !== undefined) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [isDragging, slides.length]);

  const goToSlide = useCallback((index: number) => {
    if (!isAnimating && !isDragging) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating, isDragging]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    
    setIsDragging(true);
    setIsAnimating(false);
    dragStartRef.current = {
      x: e.clientX,
      slide: currentSlide,
      offset: 0
    };
    setDragOffset(0);
    
    // Pause auto-slide
    if (autoSlideTimerRef.current !== undefined) {
      clearInterval(autoSlideTimerRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const containerWidth = containerRef.current?.offsetWidth || 600;
    const offsetPercent = (deltaX / containerWidth) * 100;
    
    // Clamp offset to prevent overscroll
    const clampedOffset = Math.min(Math.max(offsetPercent, -100), 100);
    setDragOffset(clampedOffset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 15; // 15% threshold to change slide
    
    let newSlide = currentSlide;
    
    if (dragOffset < -threshold) {
      // Dragged left - go to next slide
      newSlide = Math.min(currentSlide + 1, slides.length - 1);
    } else if (dragOffset > threshold) {
      // Dragged right - go to previous slide
      newSlide = Math.max(currentSlide - 1, 0);
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setCurrentSlide(newSlide);
    
    // Restart auto-slide
    if (autoSlideTimerRef.current !== undefined) {
      clearInterval(autoSlideTimerRef.current);
    }
    autoSlideTimerRef.current = window.setInterval(() => {
      if (!isDragging) {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 5000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      const threshold = 15;
      let newSlide = currentSlide;
      
      if (dragOffset < -threshold) {
        newSlide = Math.min(currentSlide + 1, slides.length - 1);
      } else if (dragOffset > threshold) {
        newSlide = Math.max(currentSlide - 1, 0);
      }
      
      setIsDragging(false);
      setDragOffset(0);
      setCurrentSlide(newSlide);
    }
  };

  // Calculate transform with drag offset
  const getTransform = () => {
    if (isDragging) {
      const baseOffset = currentSlide * 100;
      return `translateX(calc(-${baseOffset}% + ${dragOffset}%))`;
    }
    return `translateX(-${currentSlide * 100}%)`;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg my-4 aspect-[16/9] ${className ?? ""}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full flex cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: getTransform(),
          transition: isDragging ? "none" : "transform 500ms ease-out"
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => {
          // Pause auto-slide when mouse enters
          if (autoSlideTimerRef.current !== undefined) {
            clearInterval(autoSlideTimerRef.current);
          }
        }}
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
              if (!isAnimating && !isDragging) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setDragOffset(0);
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