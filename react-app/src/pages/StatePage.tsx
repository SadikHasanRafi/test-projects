// LESSON 2: State and events
//
// The flow:  click button -> function runs -> setState -> component RE-RUNS -> screen updates
//
// This whole function runs again after every state change.
// Each run is a "render", with its own snapshot of the state.
import { useState, type KeyboardEvent } from 'react'
import DemoCard from '../components/DemoCard'

export default function StatePage() {
  // [1] useState returns [current value, function to change it]
  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1) // never count++ : you must call the setter
  }

  function decrement() {
    setCount(count - 1)
  }

  // [2] Passing an argument to the handler
  function add(amount: number) {
    setCount((c) => c + amount)
  }

  // [3] Adding three times in a row
  function addThree() {
    // setCount(count + 1) three times would add only 1, because `count`
    // stays the same during this render. The function form gets the latest value.
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }

  // [4] Objects: create a NEW object, don't edit the old one
  const [user, setUser] = useState({ name: 'Sam', age: 20 })

  function birthday() {
    setUser({ ...user, age: user.age + 1 }) // copy, then override
  }

  // [5] Arrays: no push/shift. Make a new array
  const [fruits, setFruits] = useState(['apple', 'banana'])

  function addFruit() {
    setFruits([...fruits, `mango ${fruits.length}`])
  }

  function removeFirst() {
    setFruits(fruits.slice(1))
  }

  // [6] The event object
  const [lastKey, setLastKey] = useState('')

  function onKeydown(event: KeyboardEvent<HTMLInputElement>) {
    setLastKey(event.key)
  }

  return (
    <>
      <DemoCard title="[1] Counter">
        <p className="text-4xl font-bold">{count}</p>
        <div className="flex gap-2">
          {/* pass the function itself: onClick={increment}, NOT increment() */}
          <button className="btn" onClick={decrement}>-1</button>
          <button className="btn" onClick={increment}>+1</button>
          {/* tiny logic: wrap it in an arrow function */}
          <button className="btn" onClick={() => setCount(0)}>Reset</button>
        </div>
      </DemoCard>

      <DemoCard title="[2] Handler with an argument / [3] many updates">
        <div className="flex gap-2">
          <button className="btn" onClick={() => add(10)}>+10</button>
          <button className="btn" onClick={addThree}>+3</button>
        </div>
      </DemoCard>

      <DemoCard title="[4] Object state">
        <p>{user.name} is {user.age}</p>
        <button className="btn" onClick={birthday}>Birthday</button>
      </DemoCard>

      <DemoCard title="[5] Array state">
        <p>{fruits.join(', ')}</p>
        <div className="flex gap-2">
          <button className="btn" onClick={addFruit}>Add</button>
          <button className="btn" onClick={removeFirst}>Remove first</button>
        </div>
      </DemoCard>

      <DemoCard title="[6] Event object">
        <input className="input" placeholder="press any key" onKeyDown={onKeydown} />
        <p>Last key: {lastKey}</p>
        {/* no event modifiers: check the key yourself */}
        <input
          className="input"
          placeholder="press Enter to +1"
          onKeyUp={(e) => {
            if (e.key === 'Enter') increment()
          }}
        />
      </DemoCard>
    </>
  )
}
