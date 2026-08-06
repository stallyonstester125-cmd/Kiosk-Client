"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Ticket } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export default function CartModal({ isOpen, onClose, onProceedToPayment }: CartModalProps) {
  const {
    state,
    getSubtotal,
    getTax,
    getTotal,
    updateQuantity,
    appliedCoupon,
    isApplyingCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");

  if (!isOpen) return null;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const handleQuantityChange = (cartItemId: string, delta: number) => {
    const item = state.items.find((item) => item.cartItemId === cartItemId);
    if (item) {
      updateQuantity(cartItemId, item.quantity + delta);
    }
  };

  const handleApplyCouponClick = async () => {
    if (!couponCodeInput.trim()) return;
    await applyCoupon(couponCodeInput);
  };

  const handleRemoveCouponClick = () => {
    removeCoupon();
    setCouponCodeInput("");
  };

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
        <div className="bg-white rounded-t-3xl p-6 max-h-[85vh] flex flex-col shadow-xl">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zinc-900">Your Order</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors touch-manipulation"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-zinc-600" />
            </button>
          </div>

          {/* Item list / Empty state */}
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-zinc-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto max-h-[40vh] pr-2">
              <div className="divide-y divide-zinc-100">
                {state.items.map((item) => (
                  <div key={item.cartItemId} className="py-4 flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-900 text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{formatPrice(item.basePrice)} each</p>

                      {/* Quantity stepper */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, -1)}
                          className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center touch-manipulation hover:bg-zinc-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-zinc-600" />
                        </button>
                        <span className="w-10 text-center font-bold text-zinc-900 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, 1)}
                          className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center touch-manipulation hover:bg-zinc-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-zinc-600" />
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="flex-shrink-0 ml-auto text-right">
                      <p className="font-semibold text-zinc-900 text-sm">
                        {formatPrice(item.basePrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promo Code section */}
          {state.items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <h4 className="font-bold text-zinc-900 mb-2.5 text-xs flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                PROMO CODE
              </h4>
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase font-semibold"
                  />
                  <button
                    onClick={handleApplyCouponClick}
                    disabled={!couponCodeInput.trim() || isApplyingCoupon}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-black font-semibold rounded-lg text-xs transition-colors"
                  >
                    {isApplyingCoupon ? "..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-[10px] font-semibold text-green-800 uppercase tracking-wider">Coupon Applied</p>
                    <p className="font-bold text-green-900 text-xs mt-0.5">{appliedCoupon.coupon.code}</p>
                    <p className="text-[10px] text-green-700 mt-0.5">
                      {appliedCoupon.coupon.discount_type === "percentage"
                        ? `${appliedCoupon.coupon.percentage}% Discount`
                        : `$${appliedCoupon.coupon.fixed_amount.toFixed(2)} Discount`}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCouponClick}
                    className="text-[10px] font-bold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && (
                <p className="mt-1.5 text-[10px] text-red-600 font-semibold">{couponError}</p>
              )}
            </div>
          )}

          {/* Total row */}
          <div className="mt-4 pt-4 border-t border-zinc-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(getSubtotal())}</span>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-green-600 font-semibold">
                <span>Coupon Discount ({appliedCoupon.coupon.code})</span>
                <span>-{formatPrice(getDiscountAmount())}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Tax (Inclusive)</span>
              <span className="font-medium">{formatPrice(getTax())}</span>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
              <span className="text-sm text-zinc-600 font-medium">Total Amount</span>
              <span className="text-lg font-bold text-zinc-900">{formatPrice(getTotal())}</span>
            </div>
          </div>

          {/* Checkout button */}
          <button
            onClick={onProceedToPayment}
            disabled={state.items.length === 0}
            className="mt-4 w-full bg-[#FFA600] hover:bg-[#F5511E] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full text-base touch-manipulation transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </>
  );
}