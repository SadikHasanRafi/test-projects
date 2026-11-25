// URL parameter: /routing/users/:id
import { Link, useParams } from 'react-router'
import { users } from '../../data'

export default function UserDetail() {
  const { id } = useParams() // always a string

  const user = users.find((u) => u.id === Number(id))

  return (
    <>
      {user ? (
        <p>User #{user.id}: <b>{user.name}</b></p>
      ) : (
        <p>No user with id {id}</p>
      )}
      <Link to="/routing/users" className="text-blue-600 underline">← all users</Link>
    </>
  )
}
