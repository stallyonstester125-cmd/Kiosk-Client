import { ApiProduct } from "@/lib/api";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ApiProduct[];
  onProductClick: (product: ApiProduct) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <p className="text-zinc-400 text-base font-medium">
          No products in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-6 pb-24">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}
