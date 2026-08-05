"use client";

import { useRef, useState, useEffect, useMemo } from "react";
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
  const [activePage, setActivePage] = useState(0);

  // Calculate total pages based on 2 cards per page
  const cardsPerPage = 2;
  const totalPages = useMemo(() => Math.ceil(categories.length / cardsPerPage), [categories.length]);

  // Check if scroll buttons should be visible
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate current page based on scroll position
    const cardWidth = 150; // w-56 = 224px + gap of 12px = 236px
    const cardsPerPage = 2;
    const scrollAmount = cardWidth + 12; // 150 + 12 = 162px per card
    const pageScrollWidth = scrollAmount * cardsPerPage; // width of 2 cards
    const currentPage = Math.round(scrollLeft / pageScrollWidth);
    setActivePage(Math.min(Math.max(currentPage, 0), totalPages - 1));
  };

  // Check scroll position on mount and when categories change
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  // Scroll left or right by one page (2 cards)
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Scroll by 2 cards width (one page)
    const cardWidth = 150;
    const cardsPerPage = 2;
    const scrollAmount = (cardWidth + 12) * cardsPerPage; // (150 + 12) * 2 = 324

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Check scroll position after animation completes
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative w-full px-4 py-3">
      {/* Scrollable Categories Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-3"
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
                snap-start flex-shrink-0 w-[144px] min-w-[144px] h-[144px] rounded-2xl p-3
                flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                ${isActive
                  ? "bg-gradient-to-br from-[#FFA600] to-[#F5511E] text-white shadow-2xl ring-2 ring-orange-300"
                  : "bg-white border-2 border-zinc-100 shadow-md text-zinc-700 hover:border-orange-200 hover:scale-102"
                }
              `}
            >
              {/* Icon/Image Container */}
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors
                ${isActive ? "bg-white/20 text-white" : "bg-zinc-50 text-zinc-500"}
              `}>
                {cat.image && cat.image.trim() !== "" ? (
                  <Image
                    src={cat.image}
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                ) : (
                  <IconComponent className="w-6 h-6" strokeWidth={2} />
                )}
              </div>

              {/* Category Name */}
              <span className={`
                text-sm font-bold tracking-wide uppercase text-center leading-snug
                ${isActive ? "text-white" : "text-zinc-800"}
              `}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pagination Indicator */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`
                transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                ${activePage === i
                  ? "w-[28px] h-[7px] rounded-full bg-[#F5511E] shadow-md"
                  : "w-[8px] h-[8px] rounded-full bg-white border-2 border-[#F5511E]"
                }
              `}
              onClick={() => {
                const container = scrollContainerRef.current;
                if (!container) return;
                const cardWidth = 150;
                const cardsPerPage = 2;
                const scrollAmount = (cardWidth + 12) * 2;
                container.scrollTo({
                  left: i * (cardWidth + 12) * 2,
                  behavior: "smooth",
                });
                setActivePage(i);
              }}
              aria-label={`Go to category page ${i + 1}`}
              aria-current={activePage === i ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  );
}