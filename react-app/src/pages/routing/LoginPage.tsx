import { useNavigate, useSearchParams } from 'react-router'
import { useAuthStore } from '../../stores/auth'

export default function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  function handleLogin() {
    login('Demo user')
    // go back to the page the guard blocked
    navigate(searchParams.get('redirect') ?? '/routing', { replace: true })
  }

  return (
    <>
      <p className="mb-2">You need to log in to see that page.</p>
      <button className="btn" onClick={handleLogin}>Fake login</button>
    </>
  )
}
