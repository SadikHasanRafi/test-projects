// Query string: /routing/users?q=ri
import { Link, useSearchParams } from 'react-router'
import { users } from '../../data'

export default function UserList() {
  // works like useState, but the value lives in the URL
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-2">
      <input
        className="input"
        placeholder="search (watch the URL)"
        value={search}
        // replace = don't add a history entry on every key press
        onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
      />
      {filtered.map((user) => (
        <p key={user.id}>
          <Link to={`/routing/users/${user.id}`} className="text-blue-600 underline">
            {user.name}
          </Link>
        </p>
      ))}
    </div>
  )
}
