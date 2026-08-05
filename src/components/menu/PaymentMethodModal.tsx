"use client";

import Image from "next/image";
import { X, Wallet, CreditCard } from "lucide-react";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: "cash" | "card") => void;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSelectMethod,
}: PaymentMethodModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl p-6 flex flex-col">
          {/* Close button (top-right) */}
          <button
            onClick={onClose}
            className="self-end w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo.svg"
              alt="Kiosk Logo"
              width={110}
              height={36}
              priority
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="text-lg font-bold text-zinc-900 text-center mb-6 leading-snug">
            Where Would You Like To Pay
          </h2>

          {/* Payment option cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 - Pay At The Counter (Cash) */}
            <button
              onClick={() => onSelectMethod("cash")}
              className="relative flex flex-col items-center justify-center p-5 rounded-2xl border border-zinc-200 bg-white hover:border-[#FFA600] hover:bg-amber-50 transition-all touch-manipulation min-h-[140px]"
            >
              <Wallet className="w-10 h-10 text-[#FFA600] mb-3" strokeWidth={2} />
              <span className="text-sm font-medium text-zinc-900 text-center leading-snug">
                Pay At The Counter
              </span>
            </button>

            {/* Card 2 - Pay Here (Card) */}
            <button
              onClick={() => onSelectMethod("card")}
              className="relative flex flex-col items-center justify-center p-5 rounded-2xl border border-zinc-200 bg-white hover:border-[#FFA600] hover:bg-amber-50 transition-all touch-manipulation min-h-[140px]"
            >
              <CreditCard className="w-10 h-10 text-[#FFA600] mb-3" strokeWidth={2} />
              <span className="text-sm font-medium text-zinc-900 text-center leading-snug">
                Pay Here
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}