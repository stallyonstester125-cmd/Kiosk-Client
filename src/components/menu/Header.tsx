import Image from "next/image";

interface HeaderProps {
  // No longer needs onCartClick
}

export default function Header() {
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
    </header>
  );
}
