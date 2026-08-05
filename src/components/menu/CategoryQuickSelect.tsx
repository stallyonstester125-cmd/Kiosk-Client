"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Utensils, GlassWater, IceCream, Pizza, Flame } from "lucide-react";
import Image from "next/image";
import { ApiCategory } from "@/lib/api";

interface CategoryQuickSelectProps {
  categories: ApiCategory[];
  activeCategoryId: string | null;
  onSelect: (id: string) => void;
}

// Fallback icon mapping - used when category.image is not available
const iconMap: Record<string, any> = {
  burgers: Flame,
  burger: Flame,
  fries: Pizza,
  sides: Pizza,
  drinks: GlassWater,
  beverages: GlassWater,
  desserts: IceCream,
  dessert: IceCream,
};

function getCategoryIcon(name: string) {
  const key = name.toLowerCase().trim();
  return iconMap[key] || Utensils;
}

export default function CategoryQuickSelect({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryQuickSelectProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check if scroll buttons should be visible
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Check scroll position on mount and when categories change
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  // Scroll left or right by one card width
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Calculate scroll amount based on card width + gap
    const cardWidth = 300; // w-72 = 300px + gap of 16px = 316px
    const scrollAmount = cardWidth + 16;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Check scroll position after animation completes
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative w-full px-4 py-4">
      {/* Scroll Left Button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-zinc-50 transition-colors touch-manipulation"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-6 h-6 text-zinc-700" />
        </button>
      )}

      {/* Scrollable Categories Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4"
      >
        {categories.map((cat) => {
          const IconComponent = getCategoryIcon(cat.name);
          const isActive = activeCategoryId === cat._id;
          const hasImage = cat.image && cat.image.trim() !== "";

          return (
            <button
              key={cat._id}
              onClick={() => onSelect(cat._id)}
              className={`
                snap-start flex-shrink-0 w-[300px] min-w-[280px] aspect-square rounded-2xl p-6
                flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                ${isActive
                  ? "bg-gradient-to-br from-[#FFA600] to-[#F5511E] text-white shadow-2xl scale-105 ring-4 ring-orange-200"
                  : "bg-white border-2 border-zinc-100 shadow-md text-zinc-700 hover:border-orange-200 hover:scale-105"
                }
              `}
            >
              {/* Icon/Image Container */}
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors
                ${isActive ? "bg-white/20 text-white" : "bg-zinc-50 text-zinc-500"}
              `}>
                {cat.image && cat.image.trim() !== "" ? (
                  <Image
                    src={cat.image}
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <IconComponent className="w-10 h-10" strokeWidth={2} />
                )}
              </div>

              {/* Category Name */}
              <span className={`
                text-xl font-extrabold tracking-wide uppercase text-center leading-tight
                ${isActive ? "text-white" : "text-zinc-800"}
              `}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-zinc-50 transition-colors touch-manipulation"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-6 h-6 text-zinc-700" />
        </button>
      )}
    </div>
  );
}