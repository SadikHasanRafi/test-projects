// A deeply nested child. No props needed: it reads the context directly.
import { useContext } from 'react'
import { ThemeContext } from '../theme'

export default function ThemedBox() {
  const { theme, toggle } = useContext(ThemeContext)!

  return (
    <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-amber-100'}`}>
      <p>Theme from the parent: {theme}</p>
      <button className="btn mt-2 border border-white" onClick={toggle}>Toggle theme</button>
    </div>
  )
}
