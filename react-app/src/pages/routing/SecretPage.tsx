import { useNavigate } from 'react-router'
import { useAuthStore } from '../../stores/auth'

export default function SecretPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/routing') // leave first, so the guard doesn't send us to login
    logout()
  }

  return (
    <>
      <p className="mb-2">🔐 Secret page. Logged in as {user}.</p>
      <button className="btn" onClick={handleLogout}>Log out</button>
    </>
  )
}
