import Image from "next/image";
import CartIcon from "@/components/CartIcon";

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  return (
    <header className="w-full bg-white flex items-center px-6 py-4 shadow-sm border-b border-zinc-100">
      <div className="grid grid-cols-3 items-center w-full">
        {/* Left spacer - same width as cart icon for centering */}
        <div className="w-12" />
        {/* Centered logo */}
        <div className="justify-self-center">
          <Image
            src="/images/logo.svg"
            alt="Kiosk Logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>
        {/* Cart icon on right */}
        <CartIcon
          iconType="cart"
          onClick={onCartClick}
          className="justify-self-end w-12 h-12 flex items-center justify-center rounded-full hover:bg-zinc-50 transition-colors"
        />
      </div>
    </header>
  );
}
