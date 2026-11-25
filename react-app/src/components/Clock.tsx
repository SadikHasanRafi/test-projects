import { useEffect, useState } from 'react'

export default function Clock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString())

  useEffect(() => {
    // runs after the component appears on screen
    console.log('Clock mounted')
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)

    // the returned function runs when it is removed: clean up here
    return () => {
      console.log('Clock unmounted')
      clearInterval(timer)
    }
  }, []) // [] = only on mount

  return <p className="font-mono text-2xl">{time}</p>
}
