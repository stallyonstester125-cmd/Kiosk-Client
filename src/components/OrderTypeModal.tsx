"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

interface OrderTypeModalProps {
  isOpen: boolean;
  onSelect: (type: "eat-in" | "take-away") => void;
}

export default function OrderTypeModal({ isOpen, onSelect }: OrderTypeModalProps) {
  const [mounted, setMounted] = useState(false);
  const { setOrderType } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleSelect = (type: "eat-in" | "take-away") => {
    setOrderType(type);
    onSelect(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-6">
          How would you like your order?
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleSelect("eat-in")}
            className="flex-1 bg-[#FFA600] text-black font-bold py-6 px-8 rounded-xl text-xl touch-manipulation active:opacity-80"
          >
            EAT IN
          </button>
          <button
            onClick={() => handleSelect("take-away")}
            className="flex-1 bg-[#FFA600] text-black font-bold py-6 px-8 rounded-xl text-xl touch-manipulation active:opacity-80"
          >
            TAKE AWAY
          </button>
        </div>
      </div>
    </div>
  );
}