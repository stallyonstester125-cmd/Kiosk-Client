"use client";

import React, { createContext, useContext, useReducer, useState, useEffect, ReactNode, Dispatch } from "react";

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  basePrice: number;
  image: string;
  quantity: number;
  selectedCustomizations: { groupTitle: string; optionName: string; priceAdd: number }[];
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { cartItemId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  addToCart: (product: { _id: string; name: string; price: number; image: string }, customizations: { groupTitle: string; optionName: string; priceAdd: number }[], quantity: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  orderType: "eat-in" | "take-away" | null;
  setOrderType: (type: "eat-in" | "take-away") => void;
  clearOrderType: () => void;
  placeOrder: (customerName: string, paymentMethod: "cash" | "card", paymentStatus?: "pending" | "paid" | "failed", couponCode?: string) => Promise<{ success: boolean; data: Record<string, unknown> }>;
  appliedCoupon: any;
  isApplyingCoupon: boolean;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  getDiscountAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { items: [...state.items, action.payload] };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((item) =>
          item.cartItemId === action.payload.cartItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item.cartItemId !== action.payload) };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  // Initialize orderType from sessionStorage if available
  const [orderType, setOrderType] = useState<"eat-in" | "take-away" | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("orderType");
      if (stored === "eat-in" || stored === "take-away") {
        return stored;
      }
    }
    return null;
  });

  const addToCart = (
    product: { _id: string; name: string; price: number; image: string },
    customizations: { groupTitle: string; optionName: string; priceAdd: number }[],
    quantity = 1
  ) => {
    const customPrice = customizations.reduce((sum, c) => sum + c.priceAdd, 0);
    const newItem: CartItem = {
      cartItemId: `${product._id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId: product._id,
      name: product.name,
      basePrice: product.price + customPrice,
      image: product.image,
      quantity,
      selectedCustomizations: customizations,
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: cartItemId });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { cartItemId, quantity } });
    }
  };

  const removeFromCart = (cartItemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: cartItemId });
  };

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    removeCoupon();
  };

  const setOrderTypeWithPersistence = (type: "eat-in" | "take-away") => {
    setOrderType(type);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("orderType", type);
    }
  };

  const clearOrderType = () => {
    setOrderType(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("orderType");
    }
  };

  const getSubtotal = () =>
    state.items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

  const getTax = () => {
    if (appliedCoupon) {
      return appliedCoupon.updatedTax;
    }
    return getSubtotal() * 0.1;
  };

  const getTotal = () => {
    if (appliedCoupon) {
      return appliedCoupon.updatedTotal;
    }
    return getSubtotal() + getTax();
  };

  const getItemCount = () =>
    state.items.reduce((sum, item) => sum + item.quantity, 0);

  const getDiscountAmount = () => {
    return appliedCoupon ? appliedCoupon.discountAmount : 0;
  };

  const applyCoupon = async (code: string) => {
    if (!code.trim()) return false;
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const { validateCoupon } = await import("@/lib/api");
      const validation = await validateCoupon(code.trim(), getSubtotal());
      if (validation.valid) {
        setAppliedCoupon(validation);
        setCouponError(null);
        setIsApplyingCoupon(false);
        return true;
      } else {
        setAppliedCoupon(null);
        setCouponError(validation.reason || "Invalid coupon code");
        setIsApplyingCoupon(false);
        return false;
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err instanceof Error ? err.message : "Failed to validate coupon");
      setIsApplyingCoupon(false);
      return false;
    }
  };

  // Revalidate coupon on quantity changes
  useEffect(() => {
    const sub = getSubtotal();
    if (appliedCoupon && sub > 0) {
      const revalidate = async () => {
        try {
          const { validateCoupon } = await import("@/lib/api");
          const validation = await validateCoupon(appliedCoupon.coupon.code, sub);
          if (validation.valid) {
            setAppliedCoupon(validation);
          } else {
            setAppliedCoupon(null);
          }
        } catch {
          setAppliedCoupon(null);
        }
      };
      void revalidate();
    } else if (sub === 0 && appliedCoupon) {
      removeCoupon();
    }
  }, [state.items]);

  const placeOrder = async (
    customerName: string,
    paymentMethod: "cash" | "card" = "cash",
    paymentStatus?: "pending" | "paid" | "failed",
    couponCode?: string
  ) => {
    const { createOrder } = await import("@/lib/api");

    const items = state.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      customizations: item.selectedCustomizations.map((c) => ({
        groupId: c.groupTitle,
        groupTitle: c.groupTitle,
        options: [{
          id: c.optionName,
          name: c.optionName,
          priceAdd: c.priceAdd
        }]
      }))
    }));

    const finalCouponCode = couponCode || appliedCoupon?.coupon?.code;

    const response = await createOrder({
      orderType: orderType!,
      customerName,
      items,
      paymentMethod,
      ...(paymentStatus ? { paymentStatus } : {}),
      couponCode: finalCouponCode
    });

    if (response.success) {
      clearCart();
      clearOrderType();
    }

    return response;
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getSubtotal,
        getTax,
        getTotal,
        getItemCount,
        orderType,
        setOrderType: setOrderTypeWithPersistence,
        clearOrderType,
        placeOrder,
        appliedCoupon,
        isApplyingCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        getDiscountAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}