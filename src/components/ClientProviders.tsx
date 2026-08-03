"use client";

import { CartProvider } from "@/context/CartContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

// Load Stripe outside the component render to avoid recreating the Stripe object
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBKEY ?? ""
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Elements stripe={stripePromise}>{children}</Elements>
    </CartProvider>
  );
}