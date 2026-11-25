// LESSON 10: Custom hooks (reusable logic)
// Rule of hooks: call them at the top level, never inside if / loops.
import DemoCard from '../components/DemoCard'
import { useCounter } from '../hooks/useCounter'
import { useWindowWidth } from '../hooks/useWindowWidth'

export default function ComposablePage() {
  // each call gets its OWN state
  const { count: a, increment: incrementA, reset: resetA } = useCounter()
  const { count: b, increment: incrementB } = useCounter(100)

  const width = useWindowWidth()

  return (
    <>
      <DemoCard title="[1] useCounter used twice">
        <div className="flex gap-2">
          <button className="btn" onClick={incrementA}>A: {a}</button>
          <button className="btn" onClick={resetA}>Reset A</button>
          <button className="btn" onClick={incrementB}>B: {b}</button>
        </div>
      </DemoCard>

      <DemoCard title="[2] useWindowWidth">
        <p>Resize the window: {width}px</p>
      </DemoCard>
    </>
  )
}
