"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import OrderTypeModal from "@/components/OrderTypeModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { fetchCategories, fetchProducts, ApiCategory, ApiProduct } from "@/lib/api";

export default function MenuPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("orderType");
      return !stored;
    }
    return true;
  });

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getItemCount, setOrderType, orderType } = useCart();

  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
      setCategories(cats);
      setProducts(prods);
      if (cats.length > 0) {
        setActiveCategoryId(cats[0]._id);
      }
    } catch {
      setError("Couldn't load the menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const initLoad = async () => {
      try {
        const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
        if (!active) return;
        setCategories(cats);
        setProducts(prods);
        if (cats.length > 0) {
          setActiveCategoryId(cats[0]._id);
        }
      } catch {
        if (!active) return;
        setError("Couldn't load the menu. Please try again.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void initLoad();
    return () => {
      active = false;
    };
  }, []);

  const handleOrderTypeSelect = (type: "eat-in" | "take-away") => {
    setShowModal(false);
    setOrderType(type);
    console.log(`Order type selected: ${type}`);
  };

  const filteredProducts = products.filter(
    (p) => p.category._id === activeCategoryId
  );

  const openProductDetail = (product: ApiProduct) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#FFF8F0] flex items-center justify-center">
        <p className="text-zinc-500 text-lg">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-[#FFF8F0] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-600 text-lg">{error}</p>
        <button
          onClick={() => loadMenu()}
          className="bg-[#FFA600] text-white font-bold px-6 py-3 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0]">
      <div className="relative">
        <div
          className="w-full h-[63px] bg-[#FFA600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-between px-6"
        >
          <div className="flex gap-6 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategoryId(cat._id)}
                className={`whitespace-nowrap text-base font-medium transition-colors ${activeCategoryId === cat._id
                    ? "font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1"
                    : "text-zinc-800/80 hover:text-zinc-900"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => router.push("/cart")}
            className="relative w-12 h-12 flex items-center justify-center"
            aria-label={`Cart, ${getItemCount()} items`}
          >
            <ShoppingCart className="w-7 h-7 text-zinc-900" />
            {getItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {getItemCount() > 99 ? "99+" : getItemCount()}
              </span>
            )}
          </button>
        </div>

        <div className="p-6 max-w-7xl mx-auto grid grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <article
              key={product._id}
              onClick={() => openProductDetail(product)}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow cursor-pointer touch-manipulation"
            >
              <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-zinc-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
              </div>
              <h3 className="font-bold text-zinc-900 text-base mb-1">{product.name}</h3>
              <p className="text-sm text-zinc-500 line-clamp-3 mb-2 flex-1">
                {product.description}
              </p>
              <div className="font-bold text-zinc-900 text-lg">${product.price.toFixed(2)}</div>
            </article>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-5 text-center text-zinc-500 py-12 text-lg">
              No products in this category yet.
            </div>
          )}
        </div>
      </div>

      <OrderTypeModal
        isOpen={showModal}
        onSelect={handleOrderTypeSelect}
      />

      <ProductDetailModal
        key={selectedProduct?._id || "empty"}
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}