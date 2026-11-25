// LESSON 9: Getting a real DOM element
import { useEffect, useRef, useState } from 'react'
import DemoCard from '../components/DemoCard'

export default function RefPage() {
  // useRef gives a box: { current: ... }. Changing it does NOT re-render.
  const inputEl = useRef<HTMLInputElement>(null)
  const boxEl = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState(['first message'])

  // [1] The element exists only after mount
  useEffect(() => {
    inputEl.current?.focus()
  }, [])

  // [2] The DOM updates after the render; an effect runs after that
  useEffect(() => {
    boxEl.current?.scrollTo({ top: boxEl.current.scrollHeight })
  }, [messages])

  function addMessage() {
    setMessages([...messages, `message ${messages.length + 1}`])
  }

  return (
    <>
      <DemoCard title="[1] Focus an input">
        <input ref={inputEl} className="input" placeholder="auto focused" />
        <button className="btn ml-2" onClick={() => inputEl.current?.focus()}>Focus</button>
      </DemoCard>

      <DemoCard title="[2] Scroll to the newest item">
        <div ref={boxEl} className="h-28 overflow-y-auto rounded border border-slate-300 p-2">
          {messages.map((m) => (
            <p key={m}>{m}</p>
          ))}
        </div>
        <button className="btn" onClick={addMessage}>Add message</button>
      </DemoCard>
    </>
  )
}
