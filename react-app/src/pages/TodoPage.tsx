// LESSON 14: Everything together
// state, events, controlled input, .map(), conditions, derived values, effect
import { useEffect, useState, type SubmitEvent } from 'react'
import DemoCard from '../components/DemoCard'

type Todo = { id: number; text: string; done: boolean }
type Filter = 'all' | 'active' | 'done'

const filters: Filter[] = ['all', 'active', 'done']

export default function TodoPage() {
  // passing a function to useState = read localStorage only on the first render
  const [todos, setTodos] = useState<Todo[]>(() => JSON.parse(localStorage.getItem('todos') ?? '[]'))
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visible = todos.filter((t) => filter === 'all' || t.done === (filter === 'done'))
  const remaining = todos.filter((t) => !t.done).length

  // runs when `todos` gets a new array
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo(event: SubmitEvent) {
    event.preventDefault()
    if (!text.trim()) return
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }])
    setText('')
  }

  function toggleTodo(id: number) {
    // new array, and a new object for the one that changed
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function removeTodo(id: number) {
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <DemoCard title="Todo list">
      <form className="flex gap-2" onSubmit={addTodo}>
        <input className="input flex-1" placeholder="What to do?" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn">Add</button>
      </form>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button key={f} className="btn" disabled={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-slate-400">Nothing here.</p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {visible.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 py-2">
              <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
              <span className={`flex-1 ${todo.done ? 'text-slate-400 line-through' : ''}`}>{todo.text}</span>
              <button className="btn" onClick={() => removeTodo(todo.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-slate-500">{remaining} remaining</p>
    </DemoCard>
  )
}
