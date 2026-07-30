"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/menu");
  };

  return (
    <div
      className="relative w-screen h-screen cursor-pointer active:opacity-80"
      onClick={handleClick}
    >
      <Image
        src="/images/welcome.png"
        alt="Welcome background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <h1 className="text-7xl font-bold tracking-widest">LOGO</h1>
        <h2 className="text-6xl font-bold mt-4">Order here</h2>
        <p className="text-3xl font-medium mt-8 opacity-90">
          Tap anywhere to begin
        </p>
      </div>
    </div>
  );
}