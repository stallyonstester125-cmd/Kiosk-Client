import Image from "next/image";
import { ShoppingCart } from "lucide-react";

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  return (
    <header className="w-full bg-white flex items-center px-6 py-4 shadow-sm border-b border-zinc-100">
      <div className="w-full flex justify-center">
        <Image
          src="/images/logo.svg"
          alt="Kiosk Logo"
          width={120}
          height={40}
          priority
          className="object-contain"
        />
      </div>
      <button
        onClick={onCartClick}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFA600] flex items-center justify-center hover:bg-[#F5511E] transition-colors touch-manipulation"
        aria-label="Open cart"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7M14 11a2 2 0 11-4 0 2 2 0 014 0zM16 7h.01M8 7h.01M8 17a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2"
          />
        </svg>
      </button>
    </header>
  );
}
