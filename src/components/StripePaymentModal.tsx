"use client";

import { useState, FormEvent } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ArrowLeft, Lock, CheckCircle2, Loader2 } from "lucide-react";

interface StripePaymentModalProps {
  isOpen: boolean;
  clientSecret: string;
  amount: number;
  customerName: string;
  onSuccess: () => void;
  onClose: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#18181b",
      fontFamily: "inherit",
      "::placeholder": { color: "#a1a1aa" },
    },
    invalid: { color: "#dc2626" },
  },
};

export default function StripePaymentModal({
  isOpen,
  clientSecret,
  amount,
  customerName,
  onSuccess,
  onClose,
}: StripePaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Payment system is not ready. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card element not found.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: customerName },
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setSucceeded(true);
      // Brief success display before proceeding
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } else {
      setErrorMessage("Payment was not completed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative">
        {succeeded ? (
          /* Success state */
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Payment Successful!</h2>
            <p className="text-zinc-500 text-sm text-center">Placing your order…</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 touch-manipulation disabled:opacity-50"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-700" />
              </button>
              <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                <Lock className="w-4 h-4" />
                <span>Secured by Stripe</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-zinc-900 text-center mb-1">Card Payment</h2>
            <p className="text-zinc-500 text-center mb-6 text-sm">
              Paying{" "}
              <span className="font-semibold text-zinc-900">{formatPrice(amount)}</span>
              {" "}as <span className="font-semibold text-zinc-900">{customerName}</span>
            </p>

            <form onSubmit={handleSubmit}>
              {/* Card Element */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Card details
                </label>
                <div className="px-4 py-3.5 rounded-xl border border-zinc-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                  {errorMessage}
                </div>
              )}

              {/* Pay button */}
              <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-xl text-lg touch-manipulation transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay ${formatPrice(amount)}`
                )}
              </button>

              <p className="text-center text-xs text-zinc-400 mt-4">
                Test card: 4242 4242 4242 4242 · Any future date · Any CVC
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
