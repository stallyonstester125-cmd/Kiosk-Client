"use client";

import { useCart } from "@/context/CartContext";
import { X } from "lucide-react";

interface BottomCartBarProps {
  onClick: () => void;
  isCartModalOpen: boolean;
}

export default function BottomCartBar({ onClick, isCartModalOpen }: BottomCartBarProps) {
  const { getItemCount, clearCart } = useCart();
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  const handleCancel = () => {
    clearCart();
  };

  const handleCartClick = () => {
    onClick();
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 pb-safe transition-all duration-300 ease-out ${
      isCartModalOpen
        ? "opacity-0 pointer-events-none -translate-y-full"
        : "opacity-100 pointer-events-auto translate-y-0 animate-slide-up"
    }`}>
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-2xl shadow-xl p-3 h-[60px] flex items-center justify-between">
          {/* Left: Cancel */}
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-[#F5511E] font-medium text-sm px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors touch-manipulation"
            aria-label="Cancel and clear cart"
          >
            <X className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
            <span>Cancel</span>
          </button>

          {/* Right: Cart with quantity */}
          <button
            onClick={handleCartClick}
            className="flex items-center gap-2 bg-[#FFA600] hover:bg-[#F5511E] text-white font-medium text-sm px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 touch-manipulation active:scale-[0.98]"
            aria-label={`View cart with ${getItemCount()} items`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7M14 11a2 2 0 11-4 0 2 2 0 014 0zM16 7h.01M8 7h.01M8 17a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2"
              />
            </svg>
            <span className="font-medium">Cart ({getItemCount()})</span>
          </button>
        </div>
      </div>
    </div>
  );
}