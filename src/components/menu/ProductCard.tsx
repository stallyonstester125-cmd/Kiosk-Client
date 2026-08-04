import Image from "next/image";
import { ApiProduct } from "@/lib/api";

interface ProductCardProps {
  product: ApiProduct;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <article
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-3.5 flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-pointer touch-manipulation group active:scale-[0.98]"
    >
      <div>
        {/* Product Image */}
        <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-zinc-900 text-sm md:text-base leading-snug line-clamp-2 mb-1 group-hover:text-[#F5511E] transition-colors">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
          {product.description}
        </p>
      </div>

      {/* Footer Area: Price & + Add button */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-50">
        <span className="font-extrabold text-zinc-900 text-base">
          ${product.price.toFixed(2)}
        </span>
        <button
          type="button"
          className="bg-gradient-to-r from-[#FFA600] to-[#F5511E] hover:from-[#F5511E] hover:to-[#FFA600] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center justify-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
        >
          <span>+</span>
          <span>Add</span>
        </button>
      </div>
    </article>
  );
}
