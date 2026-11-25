import { create } from 'zustand'

type CartState = {
  items: string[]
  add: (item: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) => set((state) => ({ items: [...state.items, item] })),
  clear: () => set({ items: [] }),
}))
