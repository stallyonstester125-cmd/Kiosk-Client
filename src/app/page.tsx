"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/order-type");
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <Image
        src="/images/background.png"
        alt=""
        fill
        className="object-cover z-0"
        priority
        sizes="100vw"
      />
      <div className="relative z-10 absolute inset-0 flex flex-col items-center justify-end pb-24">
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