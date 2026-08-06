"use client";

import React, { createContext, useContext, useReducer, useState, ReactNode, Dispatch } from "react";

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

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
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

  const getTax = () => getSubtotal() * 0.1;

  const getTotal = () => getSubtotal() + getTax();

  const getItemCount = () =>
    state.items.reduce((sum, item) => sum + item.quantity, 0);

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

    const response = await createOrder({
      orderType: orderType!,
      customerName,
      items,
      paymentMethod,
      ...(paymentStatus ? { paymentStatus } : {}),
      couponCode
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
        placeOrder
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