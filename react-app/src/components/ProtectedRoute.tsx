import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '../stores/auth'

// Route guard: just a component that decides what to render
export default function ProtectedRoute() {
  const isLoggedIn = useAuthStore((state) => state.user !== null)
  const location = useLocation()

  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname)
    return <Navigate to={`/routing/login?redirect=${redirect}`} replace />
  }
  return <Outlet /> // render the child route
}
