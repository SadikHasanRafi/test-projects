// LESSON 4: Rendering lists with .map()
import { useState } from 'react'
import DemoCard from '../components/DemoCard'

const specs = { brand: 'Acme', warranty: '1 year' }

export default function ListPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Keyboard', price: 40, inStock: true },
    { id: 2, name: 'Mouse', price: 15, inStock: false },
    { id: 3, name: 'Monitor', price: 180, inStock: true },
  ])

  const available = products.filter((p) => p.inStock)

  function shuffle() {
    setProducts([...products].reverse()) // copy first: reverse() mutates
  }

  function remove(id: number) {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <>
      <DemoCard title="[1] Loop with .map() (and key)">
        <ul className="divide-y divide-slate-200">
          {/* key must be unique and stable (use an id, not the index) */}
          {products.map((product, index) => (
            <li key={product.id} className="flex justify-between py-2">
              <span className={product.inStock ? '' : 'text-slate-400 line-through'}>
                {index + 1}. {product.name} - ${product.price}
              </span>
              <button className="btn" onClick={() => remove(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
        {products.length === 0 && <p>List is empty.</p>}
        <button className="btn" onClick={shuffle}>Reverse order</button>
      </DemoCard>

      <DemoCard title="[2] Filtered list">
        {available.map((product) => (
          <p key={product.id}>{product.name}</p>
        ))}
      </DemoCard>

      <DemoCard title="[3] Loop over an object">
        {Object.entries(specs).map(([key, value]) => (
          <p key={key}>{key}: {value}</p>
        ))}
      </DemoCard>

      <DemoCard title="[4] Loop a number of times">
        <div>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
            <span key={n} className="mr-2">⭐{n}</span>
          ))}
        </div>
      </DemoCard>
    </>
  )
}
