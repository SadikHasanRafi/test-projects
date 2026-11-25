import { useState } from 'react'

// A custom hook = a function starting with "use" that holds reusable stateful logic
export function useCounter(start = 0) {
  const [count, setCount] = useState(start)
  const increment = () => setCount((c) => c + 1)
  const reset = () => setCount(start)
  return { count, increment, reset }
}
