// LESSON 13: Routing. All routes are defined in src/App.tsx
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import DemoCard from '../../components/DemoCard'

const activeBold = ({ isActive }: { isActive: boolean }) => (isActive ? 'font-bold' : '')

export default function RoutingPage() {
  const location = useLocation() // READ the current URL
  const navigate = useNavigate() // CHANGE the URL from code

  return (
    <>
      <DemoCard title="[1] Links and nested routes">
        <nav className="flex flex-wrap gap-4 text-blue-600 underline">
          {/* "end" = active only on the exact path */}
          <NavLink to="/routing" end className={activeBold}>Home</NavLink>
          <NavLink to="/routing/users" className={activeBold}>Users</NavLink>
          <NavLink to="/routing/secret" className={activeBold}>Secret (protected)</NavLink>
          <Link to="/nothing-here">Broken link (404)</Link>
        </nav>
        <p className="text-sm text-slate-500">Current path: {location.pathname + location.search}</p>
      </DemoCard>

      <DemoCard title="[2] Child route renders here">
        <Outlet />
      </DemoCard>

      <DemoCard title="[3] Navigate from code">
        <div className="flex gap-2">
          <button className="btn" onClick={() => navigate('/routing/users/2')}>Go to user 2</button>
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </DemoCard>
    </>
  )
}
