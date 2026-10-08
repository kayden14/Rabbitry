'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  deliveryState: string;
  deliveryCity: string;
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryLocation: (state: string, city: string) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getWhatsAppMessage: () => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryState: '',
      deliveryCity: '',

      addItem: (product, quantity = 1, notes) => {
        set((state) => {
          const existing = state.items.find(i => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity, notes }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], deliveryState: '', deliveryCity: '' }),

      setDeliveryLocation: (deliveryState, deliveryCity) => {
        set({ deliveryState, deliveryCity });
      },

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      getWhatsAppMessage: () => {
        const { items, deliveryState, deliveryCity } = get();
        if (!items.length) return '';
        const lines = items.map((i) => {
          let spec = '';
          if ('weightKg' in i.product && (i.product as any).weightKg) {
            spec = `, Weight: ${(i.product as any).weightKg}kg`;
          }
          return `• ${i.product.name} (Qty: ${i.quantity}${spec})`;
        });
        const location =
          deliveryState && deliveryCity
            ? `${deliveryState} State / ${deliveryCity}`
            : deliveryState ? `${deliveryState} State` : 'Nigeria';
        return encodeURIComponent(
          `Hello RABBITRY,\n\nI want to order:\n${lines.join('\n')}\n\nDelivery Destination: ${location}.\n\nPlease confirm availability and park transit freight to my location.\n\nThank you!`
        );
      },
    }),
    {
      name: 'rabbitry-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
