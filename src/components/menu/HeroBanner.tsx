import Image from "next/image";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  image: string;
  badgeText: string;
}

export default function HeroBanner({ title, subtitle, image, badgeText }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFA600] to-[#F5511E] p-5 shadow-lg mx-6 my-4">
      {/* Background styling for depth */}
      <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />

      <div className="flex justify-between items-center relative z-10">
        {/* Left Content */}
        <div className="flex-1 pr-4 text-white flex flex-col gap-2">
          {badgeText && (
            <span className="self-start px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white text-[#F5511E] rounded-full shadow-sm">
              {badgeText}
            </span>
          )}
          <h2 className="text-xl font-bold leading-tight tracking-tight drop-shadow-sm">
            {title}
          </h2>
          <p className="text-xs text-white/80 line-clamp-2">
            {subtitle}
          </p>
        </div>

        {/* Right Content - Product Image */}
        <div className="relative w-28 h-28 flex-shrink-0 drop-shadow-lg">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              priority
              className="object-contain"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-4">
        <span className="w-4 h-1.5 rounded-full bg-white transition-all" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 transition-all" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 transition-all" />
      </div>
    </div>
  );
}
