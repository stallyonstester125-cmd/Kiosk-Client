"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { Product } from "./menu-data";

export interface CartItemCustomization {
  groupId: string;
  groupTitle: string;
  selectedOptions: { id: string; name: string; priceAdd: number }[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  basePrice: number;
  quantity: number;
  customizations: CartItemCustomization[];
  image: string;
}

export interface CartState {
  items: CartItem[];
  orderType: "eat-in" | "take-away" | null;
}

export type CartAction =
  | { type: "SET_ORDER_TYPE"; payload: "eat-in" | "take-away" }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

export const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product, customizations: CartItemCustomization[], quantity?: number) => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.payload };
    case "ADD_ITEM": {
      const newItem: CartItem = {
        ...action.payload,
        id: `${action.payload.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      return { ...state, items: [...state.items, newItem] };
    }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case "CLEAR_CART":
      return { ...state, items: [], orderType: null };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], orderType: null });

  const addToCart = (
    product: Product,
    customizations: CartItemCustomization[],
    quantity = 1
  ) => {
    const customPrice = customizations.reduce(
      (sum, group) => sum + group.selectedOptions.reduce((s, opt) => s + opt.priceAdd, 0),
      0
    );

    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id,
        productName: product.name,
        basePrice: product.price + customPrice,
        quantity,
        customizations,
        image: product.image
      }
    });
  };

  const getSubtotal = () => state.items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  const getTax = () => getSubtotal() * 0.1;
  const getTotal = () => getSubtotal() + getTax();
  const getItemCount = () => state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, getSubtotal, getTax, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}