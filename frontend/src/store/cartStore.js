import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  
  addToCart: (menu) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.id === menu.id);

    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.id === menu.id ? { ...item, qty: item.qty + 1 } : item
        ),
      });
    } else {
      set({ cart: [...cart, { ...menu, qty: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter((item) => item.id !== id) });
  },

  clearCart: () => set({ cart: [] }),

  getTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.qty, 0);
  },
}));