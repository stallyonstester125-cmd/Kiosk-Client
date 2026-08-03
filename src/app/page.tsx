"use client";

import Image from "next/image";

export default function WelcomeScreen() {
  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <Image
          src="/images/logo.svg"
          alt="QuickCrave - FAST FOOD. BIG CRAVINGS."
          width={240}
          height={240}
          className="mx-auto"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-0" style={{ height: "50vh", maxHeight: "50vh" }}>
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