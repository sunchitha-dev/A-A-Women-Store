import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  size?: string
  qty: number
  price?: number
  name?: string
  code?: string
  image?: string
  details?: string
}

type CartState = {
  items: CartItem[]
  drawerOpen: boolean
  add: (id: string, size?: string, qty?: number, meta?: Omit<CartItem, 'id' | 'size' | 'qty'>) => void
  remove: (id: string, size?: string) => void
  setQty: (id: string, size: string | undefined, qty: number) => void
  setSize: (id: string, oldSize: string | undefined, newSize: string) => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const key = (id: string, size?: string) => `${id}::${size ?? ''}`

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      add: (id, size, qty = 1, meta) =>
        set((s) => {
          const k = key(id, size)
          const found = s.items.find((i) => key(i.id, i.size) === k)
          if (!found) return { items: [...s.items, { id, size, qty, ...meta }], drawerOpen: true }
          return {
            items: s.items.map((i) => (key(i.id, i.size) === k ? { ...i, qty: i.qty + qty, ...meta } : i)),
            drawerOpen: true,
          }
        }),
      remove: (id, size) =>
        set((s) => ({ items: s.items.filter((i) => key(i.id, i.size) !== key(id, size)) })),
      setQty: (id, size, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => key(i.id, i.size) !== key(id, size))
              : s.items.map((i) => (key(i.id, i.size) === key(id, size) ? { ...i, qty } : i)),
        })),
      setSize: (id, oldSize, newSize) =>
        set((s) => {
          if (oldSize === newSize) return s
          const fromK = key(id, oldSize)
          const toK = key(id, newSize)
          const from = s.items.find((i) => key(i.id, i.size) === fromK)
          if (!from) return s
          const to = s.items.find((i) => key(i.id, i.size) === toK)
          if (to) {
            return { items: s.items.filter((i) => key(i.id, i.size) !== fromK).map((i) => (key(i.id, i.size) === toK ? { ...i, qty: i.qty + from.qty } : i)) }
          }
          return { items: s.items.map((i) => (key(i.id, i.size) === fromK ? { ...i, size: newSize } : i)) }
        }),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    { name: 'aa-cart', partialize: (s) => ({ items: s.items }) },
  ),
)

export const useCartCount = () => useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))

export const useCartSubtotal = (prices: Record<string, number>) =>
  useCart((s) => s.items.reduce((sum, i) => sum + (prices[i.id] ?? 0) * i.qty, 0))
