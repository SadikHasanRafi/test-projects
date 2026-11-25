// LESSON 6: Derived values
// A value calculated FROM state. Don't store it in another useState.
import { useMemo, useState } from 'react'
import DemoCard from '../components/DemoCard'

const languages = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust']

export default function ComputedPage() {
  const [firstName, setFirstName] = useState('John')
  const [lastName, setLastName] = useState('Doe')

  // [1] Just a normal variable. It is recalculated on every render.
  const fullName = `${firstName} ${lastName}`

  // [2] Search filter
  const [search, setSearch] = useState('')

  // useMemo caches the result. YOU list the dependencies in the array.
  // Only needed for expensive work (the React Compiler can do this for you).
  const results = useMemo(
    () => languages.filter((l) => l.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  // [3] Two-way: keep one state, derive the other, convert back in onChange
  const [celsius, setCelsius] = useState(25)
  const fahrenheit = (celsius * 9) / 5 + 32

  return (
    <>
      <DemoCard title="[1] Full name">
        <input className="input mr-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <p>Full name: <b>{fullName}</b></p>
      </DemoCard>

      <DemoCard title="[2] Search">
        <input className="input" placeholder="search language" value={search} onChange={(e) => setSearch(e.target.value)} />
        <p>{results.length} found: {results.join(', ')}</p>
      </DemoCard>

      <DemoCard title="[3] Two-way conversion">
        <label>
          °C <input type="number" className="input" value={celsius} onChange={(e) => setCelsius(Number(e.target.value))} />
        </label>
        <label>
          °F{' '}
          <input
            type="number"
            className="input"
            value={fahrenheit}
            onChange={(e) => setCelsius(((Number(e.target.value) - 32) * 5) / 9)}
          />
        </label>
      </DemoCard>
    </>
  )
}
