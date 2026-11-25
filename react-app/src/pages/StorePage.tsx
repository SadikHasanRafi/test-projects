// LESSON 11: Sharing state without passing props through every level
//   Context       -> for a subtree
//   Zustand store -> for the whole app
import { useState } from 'react'
import CartBadge from '../components/CartBadge'
import DemoCard from '../components/DemoCard'
import ThemedBox from '../components/ThemedBox'
import { useCartStore } from '../stores/cart'
import { ThemeContext } from '../theme'

export default function StorePage() {
  // [1] provide to all descendants
  const [theme, setTheme] = useState('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  // [2] use the global store
  const add = useCartStore((state) => state.add)
  const clear = useCartStore((state) => state.clear)

  return (
    <>
      <DemoCard title="[1] Context">
        {/* React 19: render the context itself as the provider */}
        <ThemeContext value={{ theme, toggle }}>
          <ThemedBox />
        </ThemeContext>
      </DemoCard>

      <DemoCard title="[2] Zustand store (go to another page and come back: it stays)">
        <div className="flex gap-2">
          <button className="btn" onClick={() => add('apple')}>Add apple</button>
          <button className="btn" onClick={() => add('book')}>Add book</button>
          <button className="btn" onClick={clear}>Clear</button>
        </div>
        <CartBadge />
      </DemoCard>
    </>
  )
}
