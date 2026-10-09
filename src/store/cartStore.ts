import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface AppliedCoupon {
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
}

interface CartStore {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  taxRate: number; // e.g. 0.085 (8.5%)
  freeShippingThreshold: number; // e.g. 5000
  shippingFlatRate: number; // e.g. 150
  
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  
  // Computed getters
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      taxRate: 0.085,
      freeShippingThreshold: 5000,
      shippingFlatRate: 150,

      addItem: (item, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.id === item.id);

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const currentQty = updatedItems[existingIndex].quantity;
          const newQty = Math.min(currentQty + quantity, item.maxStock || 99);
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
          };
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: Math.min(quantity, item.maxStock || 99),
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const { coupon } = get();
        if (!coupon || subtotal <= 0) return 0;

        if (coupon.discountType === 'PERCENT') {
          return (subtotal * coupon.discountValue) / 100;
        } else {
          return Math.min(coupon.discountValue, subtotal);
        }
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal <= 0) return 0;
        return subtotal >= get().freeShippingThreshold ? 0 : get().shippingFlatRate;
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const taxableAmount = Math.max(0, subtotal - discount);
        return taxableAmount * get().taxRate;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal <= 0) return 0;
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        const tax = get().getTaxAmount();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'maison-cart-storage',
    }
  )
);
