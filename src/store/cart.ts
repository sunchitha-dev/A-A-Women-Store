import { create } from 'zustand'

export type CartItem = { id: string; qty: number }

type CartState = {
  items: CartItem[]
  add: (id: string) => void
  remove: (id: string) => void
}

export const useCart = create<CartState>((set) => ({
  items: [],
  add: (id) =>
    set((s) => {
      const found = s.items.find((i) => i.id === id)
      if (!found) return { items: [...s.items, { id, qty: 1 }] }
      return {
        items: s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
      }
    }),
  remove: (id) =>
    set((s) => ({
      items: s.items.flatMap((i) =>
        i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i],
      ),
    })),
}))

export const useCartCount = () =>
  useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))
