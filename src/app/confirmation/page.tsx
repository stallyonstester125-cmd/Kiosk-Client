"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { CheckCircle2, Copy, Timer, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

// ============================================
// CONFETTI ANIMATION
// ============================================
function Confetti() {
  const colors = ["#FFA600", "#F5511E", "#10B981", "#3B82F6", "#F97316", "#EC4899"];
  const pieces = useRef(
    Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: -20 - Math.random() * 30,
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 6,
      speed: 1 + Math.random() * 2,
      rotationSpeed: -180 + Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.floor(Math.random() * 3),
    }))
  );

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      pieces.current.forEach((piece) => {
        piece.y += piece.speed;
        piece.rotation += piece.rotationSpeed / 60;
        if (piece.y > 120) {
          piece.y = -20;
          piece.x = Math.random() * 100;
        }
      });
      forceUpdate((n) => n + 1);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 50 }}
      aria-hidden="true"
    >
      {pieces.current.map((piece, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            transform: `rotate(${piece.rotation}deg)`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 0 ? "50%" : piece.shape === 1 ? "0" : "4px",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// FLOATING FOOD ICONS
// ============================================
function FloatingFood() {
  const items = [
    { emoji: "🍔", x: 5, y: 15, delay: 0, duration: 20 },
    { emoji: "🍟", x: 90, y: 25, delay: 2, duration: 25 },
    { emoji: "🍕", x: 15, y: 70, delay: 4, duration: 22 },
    { emoji: "🥤", x: 85, y: 60, delay: 1, duration: 28 },
    { emoji: "🍔", x: 70, y: 10, delay: 3, duration: 18 },
    { emoji: "🍟", x: 25, y: 55, delay: 5, duration: 24 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }} aria-hidden="true">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: "2rem",
            opacity: 0.08,
            animation: `float ${item.duration}s ease-in-out ${item.delay}s infinite`,
            pointerEvents: "none",
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// CHECKMARK ANIMATION - Centered with no pulsing background
// ============================================
function CheckmarkAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
      {/* Removed the pulsing background div */}
      <div className="absolute inset-0 rounded-full bg-green-100 opacity-50" />
      <svg 
        className="w-16 h-16 text-green-500 relative z-10" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3"
      >
        <circle 
          className="animate-draw" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none" 
          style={{ 
            strokeDasharray: "62.83", 
            strokeDashoffset: "62.83",
            animation: "draw 0.6s ease-out 0.2s forwards"
          }} 
        />
        <polyline 
          className="animate-draw-delay" 
          points="20 6 9 17 4 12" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none" 
          style={{ 
            strokeDasharray: "25", 
            strokeDashoffset: "25",
            animation: "draw 0.4s ease-out 0.8s forwards"
          }} 
        />
      </svg>
      <style jsx>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw { 
          animation: draw 0.6s ease-out 0.2s forwards; 
        }
        .animate-draw-delay { 
          animation: draw 0.4s ease-out 0.8s forwards; 
        }
      `}</style>
    </div>
  );
}

// ============================================
// WRAPPER COMPONENTS (Defined once)
// ============================================
function ConfettiContainer() {
  return <Confetti />;
}

function FloatingFoodContainer() {
  return <FloatingFood />;
}

// ============================================
// MAIN CONFIRMATION CONTENT
// ============================================
function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, getTotal, getSubtotal, getTax } = useCart();
  const clearedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [progress, setProgress] = useState(100);

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

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        setProgress((next / 20) * 100);
        if (next <= 0) {
          clearInterval(timer);
          router.push("/");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  const displayTotal = orderTotal ? parseFloat(orderTotal) : total;
  const displaySubtotal = orderSubtotal ? parseFloat(orderSubtotal) : subtotal;
  const displayTax = orderTax ? parseFloat(orderTax) : tax;

  const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0] relative overflow-hidden">
      {/* Celebration Effects */}
      <ConfettiContainer />
      <FloatingFoodContainer />

      {/* Header */}
      <div
        className="w-full h-[80px] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)] flex items-center justify-center px-6 border-b border-zinc-100"
      >
        <Image
          src="/images/logo.svg"
          alt="Kiosk Logo"
          width={140}
          height={45}
          priority
          className="object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-md mx-auto">
        {/* Success Section */}
        <div className="text-center mb-8">
          <CheckmarkAnimation />
          <h2 className="mt-4 text-2xl font-bold text-zinc-900">Order Confirmed!</h2>
          <p className="mt-2 text-zinc-500">Thank you! Your order has been placed successfully.</p>
        </div>

        {/* Order Number Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-zinc-900">Order Number</h3>
            <button
              onClick={() => navigator.clipboard.writeText(orderNumber || "")}
              className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Copy order number"
            >
              <Copy className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          <div className="bg-zinc-50 rounded-xl p-4 font-mono text-xl font-bold text-center text-zinc-900 tracking-wide">
            #{orderNumber || "—"}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-5">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(displaySubtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Tax</span>
              <span className="font-medium">{formatPrice(displayTax)}</span>
            </div>
            <div className="border-t border-zinc-200 pt-3 flex justify-between">
              <span className="font-semibold text-zinc-900">Total</span>
              <span className="text-xl font-bold text-[#F5511E]">{formatPrice(displayTotal)}</span>
            </div>
          </div>
        </div>

        {/* Estimated Preparation Time */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-5 flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Timer className="w-6 h-6 text-amber-600" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Estimated Preparation Time</p>
            <p className="text-xl font-bold text-zinc-900">10–15 Minutes</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#FFA600] hover:bg-[#F5511E] text-white font-bold py-3.5 px-6 rounded-full text-lg touch-manipulation transition-colors shadow-lg"
        >
          Start New Order
        </button>

        {/* Auto Return Countdown */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="w-5 h-5 text-orange-500" strokeWidth={2} />
            <span className="text-sm text-zinc-600">
              Returning to Home in <span className="font-bold text-orange-600">{timeLeft}</span> seconds
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFA600] rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-screen bg-[#FFF8F0] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#FFA600]" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}