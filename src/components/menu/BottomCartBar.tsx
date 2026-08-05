"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, ChevronRight } from "lucide-react";

interface BottomCartBarProps {
  onClick: () => void;
}

export default function BottomCartBar({ onClick }: BottomCartBarProps) {
  const { getItemCount, getTotal } = useCart();
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const itemText = itemCount === 1 ? "Item" : "Items";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up pb-safe">
      <div className="mx-4 mb-4">
        <div className="bg-[#FFA600] rounded-2xl shadow-2xl p-4 flex items-center justify-between">
          {/* Left: Cart icon + quantity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">
                {getItemCount()} {getItemCount() === 1 ? "Item" : "Items"}
              </p>
              <p className="text-white/80 text-xs leading-tight">
                {getItemCount() === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Center: Total amount */}
          <div className="flex-1 text-center hidden md:block">
            <p className="text-white/80 text-xs uppercase tracking-wider mb-0.5">
              Total
            </p>
            <p className="text-white font-bold text-lg">
              ${getTotal().toFixed(2)}
            </p>
          </div>

          {/* Right: View Cart button */}
          <button
            onClick={onClick}
            className="w-full md:w-auto bg-white text-[#F5511E] font-bold py-2.5 px-5 rounded-full text-sm touch-manipulation hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5"
            type="button"
          >
            <span>View Cart</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}