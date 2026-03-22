import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  // Fungsi nambahin barang ke keranjang
  addToCart: (newItem) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === newItem.id);
      if (existingItem) {
        // Kalau udah ada, tambahin jumlahnya aja
        return {
          items: state.items.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      // Kalau belum ada, masukin barang baru dengan jumlah 1
      return { items: [...state.items, { ...newItem, quantity: 1 }] };
    }),

  // Fungsi nambah/ngurangin barang (+ / -)
  updateQuantity: (id, delta) =>
    set((state) => {
      const updatedItems = state.items
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Kalau jumlahnya 0, otomatis hilang dari keranjang

      return { items: updatedItems };
    }),

  // Fungsi ngosongin keranjang pas udah selesai order
  clearCart: () => set({ items: [] }),
}));
