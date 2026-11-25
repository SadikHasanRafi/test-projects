// LESSON 8: Components: props (down), callbacks (up), children
import { useState } from 'react'
import DemoCard from '../components/DemoCard'
import NameInput from '../components/NameInput'
import Panel from '../components/Panel'
import UserCard from '../components/UserCard'

export default function ComponentsPage() {
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('Alex')

  function handleGreet(text: string) {
    setMessage(text)
  }

  return (
    <>
      <DemoCard title="[1] Props down, [2] events up">
        <UserCard name="Rina" role="admin" onGreet={handleGreet} />
        <UserCard name="Karim" onGreet={handleGreet} />
        <p>Parent received: <b>{message}</b></p>
      </DemoCard>

      <DemoCard title="[3] children and JSX props">
        <Panel header="Custom header">
          <p>This paragraph was written in the parent.</p>
        </Panel>
        <Panel>Only body, header uses the fallback.</Panel>
      </DemoCard>

      <DemoCard title="[4] Two-way binding with a child">
        <NameInput value={username} onChange={setUsername} />
        <p>Parent state: {username}</p>
        <button className="btn" onClick={() => setUsername('')}>Clear from parent</button>
      </DemoCard>
    </>
  )
}
