import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./types";

interface CartState {
  cartItems: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (productId, variantId, quantity) =>
        set((state) => {
          const existingIdx = state.cartItems.findIndex(
            (item) => item.variantId === variantId
          );
          if (existingIdx > -1) {
            const updated = [...state.cartItems];
            updated[existingIdx].quantity += quantity;
            return { cartItems: updated };
          } else {
            const newItem: CartItem = {
              id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              productId,
              variantId,
              quantity,
            };
            return { cartItems: [...state.cartItems, newItem] };
          }
        }),
      removeItem: (variantId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.variantId !== variantId),
        })),
      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              cartItems: state.cartItems.filter((item) => item.variantId !== variantId),
            };
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.variantId === variantId ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "kiwi-cart-storage",
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
