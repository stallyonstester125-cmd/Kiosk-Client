import Image from "next/image";

export default function HeroBanner({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className ?? ""}`}>
      <Image
        src="/images/hero.png"
        alt="Kiosk Promo"
        fill
        priority
        className="object-cover rounded-2xl"
        sizes="100vw"
      />
    </div>
  );
}
