"use client";

import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import NameEntryModal from "@/components/NameEntryModal";
import StripePaymentModal from "@/components/StripePaymentModal";
import { createPaymentIntent } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const {
    state,
    getSubtotal,
    getTax,
    getTotal,
    getItemCount,
    updateQuantity,
    removeFromCart,
    orderType,
    placeOrder,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");
  const [showNameModal, setShowNameModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Stripe modal state
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeAmount, setStripeAmount] = useState(0);
  const [pendingCustomerName, setPendingCustomerName] = useState("");

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const handleAddMoreItems = () => {
    router.push("/menu");
  };

  const handleContinueToPayment = () => {
    if (state.items.length === 0) return;
    setOrderError(null);
    setShowNameModal(true);
  };

  /** Called by NameEntryModal after the customer enters their name */
  const handleNameSubmit = async (name: string) => {
    if (!orderType) {
      setOrderError("Please select an order type first");
      return;
    }

    setOrderError(null);

    if (paymentMethod === "cash") {
      // ── CASH FLOW: unchanged behaviour ──────────────────────────────────
      setIsPlacingOrder(true);
      try {
        const response = await placeOrder(name, "cash");
        if (response.success) {
          const data = response.data as {
            _id: string;
            orderNumber: string;
            total: number;
            subtotal: number;
            tax: number;
          };
          router.push(
            `/confirmation?orderId=${data._id}&orderNumber=${data.orderNumber}&total=${data.total}&subtotal=${data.subtotal}&tax=${data.tax}`
          );
        } else {
          setOrderError("Failed to place order. Please try again.");
        }
      } catch (error) {
        setOrderError(error instanceof Error ? error.message : "Failed to place order");
      } finally {
        setIsPlacingOrder(false);
        setShowNameModal(false);
      }
    } else {
      // ── CARD FLOW: create PaymentIntent → show Stripe modal ─────────────
      setIsPlacingOrder(true);
      try {
        const cartItems = state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          customizations: item.selectedCustomizations.map((c) => ({
            groupId: c.groupTitle,
            groupTitle: c.groupTitle,
            options: [{ id: c.optionName, name: c.optionName, priceAdd: c.priceAdd }],
          })),
        }));

        const { clientSecret, amount } = await createPaymentIntent({
          orderType,
          customerName: name,
          items: cartItems,
        });

        setPendingCustomerName(name);
        setStripeClientSecret(clientSecret);
        setStripeAmount(amount);
        setShowNameModal(false);
        setShowStripeModal(true);
      } catch (error) {
        setOrderError(
          error instanceof Error ? error.message : "Failed to prepare payment"
        );
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  /** Called by StripePaymentModal after stripe.confirmCardPayment() succeeds */
  const handlePaymentSuccess = async () => {
    setShowStripeModal(false);
    setIsPlacingOrder(true);
    try {
      const response = await placeOrder(pendingCustomerName, "card", "paid");
      if (response.success) {
        const data = response.data as {
          _id: string;
          orderNumber: string;
          total: number;
          subtotal: number;
          tax: number;
        };
        router.push(
          `/confirmation?orderId=${data._id}&orderNumber=${data.orderNumber}&total=${data.total}&subtotal=${data.subtotal}&tax=${data.tax}`
        );
      } else {
        setOrderError("Payment succeeded but order creation failed. Please contact staff.");
      }
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Order creation failed after payment"
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleStripeClose = () => {
    setShowStripeModal(false);
    setStripeClientSecret(null);
    setPendingCustomerName("");
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0]">
      <div
        className="w-full h-[63px] bg-[#FFA600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-between px-6"
      >
        <button
          onClick={handleAddMoreItems}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 touch-manipulation"
          aria-label="Back to menu"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-widest">LOGO</h1>
        <button
          onClick={handleAddMoreItems}
          className="w-10 h-10 flex items-center justify-center relative"
          aria-label={`Cart, ${getItemCount()} items`}
        >
          <span className="relative">
            <X className="w-6 h-6 text-white" />
            {getItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {getItemCount() > 99 ? "99+" : getItemCount()}
              </span>
            )}
          </span>
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Your Cart</h2>
            <p className="text-zinc-500">YOUR ORDER ({getItemCount()} item{getItemCount() !== 1 ? "s" : ""})</p>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center text-zinc-500 py-12 text-lg">
              Your cart is empty. Add items from the menu.
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.cartItemId} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex gap-4 mb-3">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-zinc-900">{item.name}</h3>
                      <p className="text-zinc-500 text-sm">{formatPrice(item.basePrice)}</p>
                      {item.selectedCustomizations.length > 0 && (
                        <div className="mt-2 space-y-1 ml-4 border-l-2 border-zinc-200 pl-3">
                          {item.selectedCustomizations.map((c, idx) => (
                            <div key={idx} className="text-sm text-zinc-600 flex items-center gap-1">
                              <span className="font-medium">{c.groupTitle}:</span>
                              <span>{c.optionName}</span>
                              {c.priceAdd > 0 && (
                                <span className="text-amber-600 font-semibold">+${c.priceAdd.toFixed(2)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center touch-manipulation hover:bg-zinc-50"
                        aria-label="Decrease quantity"
                      >
                        <span className="text-zinc-600 font-bold">−</span>
                      </button>
                      <span className="w-10 text-center font-bold text-zinc-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                        className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center touch-manipulation hover:bg-zinc-50"
                        aria-label="Increase quantity"
                      >
                        <span className="text-zinc-600 font-bold">+</span>
                      </button>
                    </div>
                    <span className="font-bold text-zinc-900 text-lg">
                      {formatPrice(item.basePrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAddMoreItems}
            className="w-full mt-6 py-3 rounded-xl border-2 border-amber-500 text-amber-600 font-semibold hover:bg-amber-50 transition-colors touch-manipulation"
          >
            + Add more items
          </button>

          {state.items.length > 0 && (
            <>
              <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
                <h3 className="font-bold text-zinc-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50 touch-manipulation">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="w-5 h-5 text-amber-500 border-zinc-300 focus:ring-amber-500"
                    />
                    <span className="font-medium text-zinc-900">Cash</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-amber-300 rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100 touch-manipulation">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-5 h-5 text-amber-500 border-zinc-300 focus:ring-amber-500"
                    />
                    <span className="font-medium text-zinc-900">Card</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 h-fit">
            <h3 className="font-bold text-zinc-900 mb-4">ORDER SUMMARY</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Tip</span>
                <span className="font-medium">{formatPrice(0)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Tax (Inclusive)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mb-4 text-center">Tax will be collected at checkout</p>
            <div className="border-t border-zinc-200 pt-4">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {orderError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                  {orderError}
                </div>
              )}

              <button
                onClick={handleContinueToPayment}
                disabled={state.items.length === 0 || isPlacingOrder}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-xl text-lg touch-manipulation transition-colors"
              >
                {isPlacingOrder ? "Processing…" : "Continue to payment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Name entry modal — always present */}
      <NameEntryModal
        isOpen={showNameModal}
        onClose={() => {
          setShowNameModal(false);
          setOrderError(null);
        }}
        onSubmit={handleNameSubmit}
        isLoading={isPlacingOrder}
        error={orderError}
      />

      {/* Stripe payment modal — shown only for card payments */}
      {stripeClientSecret && (
        <StripePaymentModal
          isOpen={showStripeModal}
          clientSecret={stripeClientSecret}
          amount={stripeAmount}
          customerName={pendingCustomerName}
          onSuccess={handlePaymentSuccess}
          onClose={handleStripeClose}
        />
      )}
    </div>
  );
}