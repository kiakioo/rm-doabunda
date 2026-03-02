import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (menu) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === menu.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === menu.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...menu, qty: 1 }] };
    });
  },

  // FITUR BARU: Tambah jumlah
  increaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      ),
    }));
  },

  // FITUR BARU: Kurangi jumlah (Hapus otomatis jika mencapai 0)
  decreaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      ).filter(item => item.qty > 0) 
    }));
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  },
}));