"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, getTotal, getSubtotal, getTax } = useCart();
  const clearedRef = useRef(false);

  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const orderTotal = searchParams.get("total");
  const orderSubtotal = searchParams.get("subtotal");
  const orderTax = searchParams.get("tax");

  useEffect(() => {
    if (!clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
    const timer = setTimeout(() => {
      router.push("/");
    }, 30000);
    return () => clearTimeout(timer);
  }, [clearCart, router]);

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

  // Use order values from URL params if available, otherwise fallback to local cart values
  const displayTotal = orderTotal ? parseFloat(orderTotal) : total;
  const displaySubtotal = orderSubtotal ? parseFloat(orderSubtotal) : subtotal;
  const displayTax = orderTax ? parseFloat(orderTax) : tax;

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0]">
      <div
        className="w-full h-[63px] bg-[#FFA600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-between px-6"
      >
        <button
          onClick={() => router.push("/")}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 touch-manipulation"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-widest">LOGO</h1>
        <div className="w-10" />
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Total {formatPrice(displayTotal)}</h2>
              <div className="space-y-3 text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(displaySubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (Inclusive)</span>
                  <span className="font-medium">{formatPrice(displayTax)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Thanks For Order</h2>
              <p className="text-zinc-500">Order {orderNumber ? `#${orderNumber}` : "is being prepared..."}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100">
                <Image
                  src="/images/illustration-man-waiting-food 1.png"
                  alt="Order being prepared"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-screen bg-[#FFF8F0] flex items-center justify-center"><p className="text-zinc-500 text-lg">Loading...</p></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}