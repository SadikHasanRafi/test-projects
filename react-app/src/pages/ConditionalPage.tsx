// LESSON 3: Conditional rendering
// There are no special directives. You use plain JavaScript.
import { useState } from 'react'
import DemoCard from '../components/DemoCard'

// [3] else-if chain: a function with early returns
function Grade({ score }: { score: number }) {
  if (score >= 80) return <p>Grade: A</p>
  if (score >= 50) return <p>Grade: B</p>
  return <p>Grade: Fail</p>
}

export default function ConditionalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [score, setScore] = useState(50)
  const [showBox, setShowBox] = useState(true)
  const [items, setItems] = useState<string[]>([])

  return (
    <>
      <DemoCard title="[1] if / else: ternary ? :">
        {isLoggedIn ? (
          <p className="text-emerald-600">Welcome back!</p>
        ) : (
          <p className="text-red-600">Please log in.</p>
        )}
        <button className="btn" onClick={() => setIsLoggedIn(!isLoggedIn)}>
          {/* [2] ternary for text */}
          {isLoggedIn ? 'Log out' : 'Log in'}
        </button>
      </DemoCard>

      <DemoCard title="[3] else-if chain">
        <input type="range" min="0" max="100" value={score} onChange={(e) => setScore(Number(e.target.value))} />
        <p>Score: {score}</p>
        <Grade score={score} />
      </DemoCard>

      <DemoCard title="[4] Show only when true: &&">
        {score === 100 && <p>Perfect score! 🎉</p>}
        {score !== 100 && <p className="text-slate-400">(drag to 100)</p>}

        {/* careful: use items.length === 0, because {0 && ...} would print "0" */}
        {items.length === 0 ? (
          <>
            <p>No items yet.</p>
            <button className="btn" onClick={() => setItems([...items, 'item'])}>Add one</button>
          </>
        ) : (
          <>
            <p>You have {items.length} item(s).</p>
            <button className="btn" onClick={() => setItems([])}>Clear</button>
          </>
        )}
      </DemoCard>

      <DemoCard title="[5] Hide with CSS">
        <button className="btn" onClick={() => setShowBox(!showBox)}>Toggle</button>
        {/* && removes the element from the DOM. To keep it, toggle a CSS class */}
        <div className={`rounded bg-amber-100 p-3 ${showBox ? '' : 'hidden'}`}>
          My typed text survives hiding: <input className="input" />
        </div>
      </DemoCard>
    </>
  )
}
