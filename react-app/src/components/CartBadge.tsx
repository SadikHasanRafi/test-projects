import { useCartStore } from '../stores/cart'

export default function CartBadge() {
  // select only what you need: re-renders only when it changes
  const items = useCartStore((state) => state.items)

  return (
    <p>🛒 {items.length} item(s): {items.join(', ')}</p>
  )
}
