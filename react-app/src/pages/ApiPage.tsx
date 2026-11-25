// LESSON 12: API calls
// Free fake API: https://jsonplaceholder.typicode.com
// Real projects often use TanStack Query (works for React and Vue). Learn this first.
import { useState, type SubmitEvent } from 'react'
import DemoCard from '../components/DemoCard'
import { useFetch } from '../hooks/useFetch'

const API = 'https://jsonplaceholder.typicode.com'
type Post = { id: number; title: string }

export default function ApiPage() {
  // [1] GET that re-runs when userId changes
  const [userId, setUserId] = useState(1)
  const { data: posts, loading, error, refetch } = useFetch<Post[]>(
    `${API}/posts?userId=${userId}&_limit=3`,
  )

  // [2] A broken URL, to see the error state
  const { error: brokenError, loading: brokenLoading } = useFetch(`${API}/wrong-url`)

  // [3] POST when a form is submitted
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState<Post | null>(null)
  const [saveError, setSaveError] = useState('')

  async function createPost(event: SubmitEvent) {
    event.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, userId: 1 }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCreated(await res.json())
      setTitle('')
    } catch (e) {
      setSaveError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DemoCard title="[1] GET with loading and error">
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button key={n} className="btn" disabled={userId === n} onClick={() => setUserId(n)}>
              User {n}
            </button>
          ))}
          <button className="btn" onClick={refetch}>Reload</button>
        </div>
        {loading ? (
          <p className="animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <ul className="list-disc pl-5">
            {posts?.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
      </DemoCard>

      <DemoCard title="[2] Error state (broken URL)">
        {brokenLoading ? <p>Loading...</p> : <p className="text-red-600">Error: {brokenError}</p>}
      </DemoCard>

      <DemoCard title="[3] POST">
        <form className="flex gap-2" onSubmit={createPost}>
          <input className="input" placeholder="post title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
        </form>
        {saveError && <p className="text-red-600">{saveError}</p>}
        {/* this fake API answers like a real one but saves nothing */}
        {created && <p>Server returned id {created.id}: {created.title}</p>}
      </DemoCard>
    </>
  )
}
