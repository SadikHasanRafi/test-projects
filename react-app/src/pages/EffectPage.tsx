// LESSON 7: Effects and lifecycle (side effects)
// "When something changes, DO something" (save, log, fetch, set timer)
//
//   useEffect(fn)          -> after every render
//   useEffect(fn, [])      -> after mount
//   useEffect(fn, [a, b])  -> after mount, and when a or b changes
// Open the browser console to see the logs.
import { useEffect, useState } from 'react'
import Clock from '../components/Clock'
import DemoCard from '../components/DemoCard'

export default function EffectPage() {
  const [count, setCount] = useState(0)
  const [log, setLog] = useState('')
  const [name, setName] = useState(() => localStorage.getItem('name') ?? '')
  const [showClock, setShowClock] = useState(true)

  // [1] Run once, after the component is on screen
  useEffect(() => {
    console.log('EffectPage mounted')
  }, [])

  // [2] React gives no "old value". If the change comes from a click,
  // do the work in the event handler, where you know both values.
  function increment() {
    setLog(`count went from ${count} to ${count + 1}`)
    setCount(count + 1)
  }

  // [3] Sync state with something outside React
  useEffect(() => {
    localStorage.setItem('name', name)
  }, [name])

  // [4] Another effect
  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])

  return (
    <>
      <DemoCard title="[2] React to a change / [4] check the tab title">
        <button className="btn" onClick={increment}>count: {count}</button>
        <p>{log || 'click the button'}</p>
      </DemoCard>

      <DemoCard title="[3] Auto-save to localStorage">
        <input className="input" placeholder="type, then refresh the page" value={name} onChange={(e) => setName(e.target.value)} />
      </DemoCard>

      <DemoCard title="[5] Mount / unmount a child">
        <button className="btn" onClick={() => setShowClock(!showClock)}>
          {showClock ? 'Remove clock' : 'Add clock'}
        </button>
        {showClock && <Clock />}
      </DemoCard>
    </>
  )
}
