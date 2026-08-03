"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const poppinsFont = { fontFamily: "var(--font-poppins)" };

export default function OrderTypePage() {
  const router = useRouter();
  const { setOrderType } = useCart();

  const handleSelect = (type: "eat-in" | "take-away") => {
    setOrderType(type);
    router.push("/menu");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      <Image
        src="/images/background.png"
        alt=""
        fill
        className="object-cover z-0"
        priority
        sizes="100vw"
      />
      <div className="relative z-10 flex flex-col h-full items-center px-6 pt-8 pb-20">
        <p className="text-zinc-500 text-sm font-medium mb-8 w-full text-left" style={poppinsFont}>
          dine in / Take away
        </p>
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-xs">
          <h1 className="font-semibold text-2xl text-zinc-900 mb-3 leading-tight" style={poppinsFont}>
            Welcome! Let&apos;s get started
          </h1>
          <p className="text-base text-zinc-600 mb-8 leading-relaxed max-w-xs mx-auto" style={poppinsFont}>
            On the go? We&apos;ll have your meal ready for you to take away
          </p>
          <div className="flex gap-4 w-full max-w-md">
            <button
              onClick={() => handleSelect("eat-in")}
              className="flex-1 flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-zinc-200 shadow-sm touch-manipulation active:scale-[0.98] transition-transform"
              aria-label="Dine In"
            >
              <Image
                src="/images/dinein.png"
                alt="Dine In"
                width={56}
                height={56}
                className="mb-4"
              />
              <span className="font-semibold text-base text-zinc-900 mb-1 block" style={poppinsFont}>
                Dine In
              </span>
              <p className="text-xs text-zinc-500 text-center leading-relaxed" style={poppinsFont}>
                Relax and enjoy your meal in our comfortable seating area.
              </p>
            </button>
            <button
              onClick={() => handleSelect("take-away")}
              className="flex-1 flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-zinc-200 shadow-sm touch-manipulation active:scale-[0.98] transition-transform"
              aria-label="Take away"
            >
              <Image
                src="/images/takeaway.png"
                alt="Take away"
                width={56}
                height={56}
                className="mb-4"
              />
              <span className="font-semibold text-base text-zinc-900 mb-1 block" style={poppinsFont}>
                Take away
              </span>
              <p className="text-xs text-zinc-500 text-center leading-relaxed" style={poppinsFont}>
                On the go? We&apos;ll have your meal ready for you to take away.
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-0" style={{ height: "45vh", maxHeight: "45vh" }}>
        <Image
          src="/images/wave.svg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    </div>
  );
}