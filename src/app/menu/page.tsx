"use client";

import { useEffect, useState } from "react";
import ProductDetailModal from "@/components/ProductDetailModal";
import NameEntryModal from "@/components/NameEntryModal";
import StripePaymentModal from "@/components/StripePaymentModal";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { fetchCategories, fetchProducts, ApiCategory, ApiProduct, createPaymentIntent } from "@/lib/api";
import Header from "@/components/menu/Header";
import HeroBanner from "@/components/menu/HeroBanner";
import CategoryQuickSelect from "@/components/menu/CategoryQuickSelect";
import ProductGrid from "@/components/menu/ProductGrid";
import CartModal from "@/components/menu/CartModal";
import PaymentMethodModal from "@/components/menu/PaymentMethodModal";
import BottomCartBar from "@/components/menu/BottomCartBar";

export default function MenuPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");
  const [showNameModal, setShowNameModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stripe modal state
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeAmount, setStripeAmount] = useState(0);
  const [pendingCustomerName, setPendingCustomerName] = useState("");

  const { state, getItemCount, orderType, placeOrder } = useCart();

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

  const filteredProducts = products.filter(
    (p) => p.category._id === activeCategoryId
  );

  const openProductDetail = (product: ApiProduct) => {
    setSelectedProduct(product);
  };

  const handleOpenCart = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartModalOpen(false);
  };

  const handleProceedToPayment = () => {
    setIsCartModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleSelectPaymentMethod = (method: "cash" | "card") => {
    setPaymentMethod(method);
    setIsPaymentModalOpen(false);
    setShowNameModal(true);
  };

  /** Called by NameEntryModal after the customer enters their name */
  const handleNameSubmit = async (name: string) => {
    if (!orderType) {
      setOrderError("Please select an order type first");
      return;
    }

    setOrderError(null);

    if (paymentMethod === "cash") {
      // ── CASH FLOW ──────────────────────────────────
      setIsPlacingOrder(true);
      try {
        const response = await placeOrder(name, "cash");
        if (response.success) {
          const data = response.data as {
            _id: string;
            orderNumber: string;
            total: number;
            subtotal: number;
            tax: number;
          };
          router.push(
            `/confirmation?orderId=${data._id}&orderNumber=${data.orderNumber}&total=${data.total}&subtotal=${data.subtotal}&tax=${data.tax}`
          );
        } else {
          setOrderError("Failed to place order. Please try again.");
        }
      } catch (error) {
        setOrderError(error instanceof Error ? error.message : "Failed to place order");
      } finally {
        setIsPlacingOrder(false);
        setShowNameModal(false);
      }
    } else {
      // ── CARD FLOW: create PaymentIntent → show Stripe modal ─────────────
      setIsPlacingOrder(true);
      try {
        const cartItems = state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          customizations: item.selectedCustomizations.map((c) => ({
            groupId: c.groupTitle,
            groupTitle: c.groupTitle,
            options: [{ id: c.optionName, name: c.optionName, priceAdd: c.priceAdd }],
          })),
        }));

        const { clientSecret, amount } = await createPaymentIntent({
          orderType,
          customerName: name,
          items: cartItems,
        });

        setPendingCustomerName(name);
        setStripeClientSecret(clientSecret);
        setStripeAmount(amount);
        setShowNameModal(false);
        setShowStripeModal(true);
      } catch (error) {
        setOrderError(
          error instanceof Error ? error.message : "Failed to prepare payment"
        );
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  /** Called by StripePaymentModal after stripe.confirmCardPayment() succeeds */
  const handlePaymentSuccess = async () => {
    setShowStripeModal(false);
    setIsPlacingOrder(true);
    try {
      const response = await placeOrder(pendingCustomerName, "card", "paid");
      if (response.success) {
        const data = response.data as {
          _id: string;
          orderNumber: string;
          total: number;
          subtotal: number;
          tax: number;
        };
        router.push(
          `/confirmation?orderId=${data._id}&orderNumber=${data.orderNumber}&total=${data.total}&subtotal=${data.subtotal}&tax=${data.tax}`
        );
      } else {
        setOrderError("Payment succeeded but order creation failed. Please contact staff.");
      }
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Order creation failed after payment"
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleStripeClose = () => {
    setShowStripeModal(false);
    setStripeClientSecret(null);
    setPendingCustomerName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="loader" />
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
    <div className="min-h-screen w-screen bg-[#FFF8F0] flex flex-col">
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full flex flex-col">
        <HeroBanner />

        <CategoryQuickSelect
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />

        <ProductGrid
          products={filteredProducts}
          onProductClick={openProductDetail}
        />
      </main>

      <ProductDetailModal
        key={selectedProduct?._id || "empty"}
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onProceedToPayment={handleProceedToPayment}
      />

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectMethod={handleSelectPaymentMethod}
      />

      <NameEntryModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSubmit={handleNameSubmit}
        isLoading={isPlacingOrder}
        error={orderError}
      />

      <StripePaymentModal
        isOpen={showStripeModal}
        clientSecret={stripeClientSecret ?? ""}
        amount={stripeAmount}
        customerName={pendingCustomerName}
        onSuccess={handlePaymentSuccess}
        onClose={() => {
          setShowStripeModal(false);
          setStripeClientSecret(null);
          setPendingCustomerName("");
        }}
      />

      <BottomCartBar onClick={handleOpenCart} isCartModalOpen={isCartModalOpen} isPaymentModalOpen={isPaymentModalOpen} />
    </div>
  );
}