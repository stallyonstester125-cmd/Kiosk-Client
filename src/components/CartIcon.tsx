"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, X } from "lucide-react";

interface CartIconProps {
  iconType: "cart" | "close";
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function CartIcon({ iconType, onClick, ariaLabel, className = "" }: CartIconProps) {
  const { getItemCount } = useCart();
  const count = getItemCount();

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center ${className}`}
      aria-label={ariaLabel || (iconType === "cart" ? `Cart, ${count} items` : `Close cart, ${count} items`)}
    >
      {iconType === "cart" ? (
        <ShoppingCart className="w-7 h-7 text-zinc-900" />
      ) : (
        <X className="w-6 h-6 text-white" />
      )}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}