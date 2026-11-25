import { lazy, Suspense } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import { lessons } from './lessons'
import NotFoundPage from './pages/NotFoundPage'

// lazy(() => import(...)) = the page is downloaded only when visited
const TemplatePage = lazy(() => import('./pages/TemplatePage'))
const StatePage = lazy(() => import('./pages/StatePage'))
const ConditionalPage = lazy(() => import('./pages/ConditionalPage'))
const ListPage = lazy(() => import('./pages/ListPage'))
const FormPage = lazy(() => import('./pages/FormPage'))
const ComputedPage = lazy(() => import('./pages/ComputedPage'))
const EffectPage = lazy(() => import('./pages/EffectPage'))
const ComponentsPage = lazy(() => import('./pages/ComponentsPage'))
const RefPage = lazy(() => import('./pages/RefPage'))
const ComposablePage = lazy(() => import('./pages/ComposablePage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const ApiPage = lazy(() => import('./pages/ApiPage'))
const RoutingPage = lazy(() => import('./pages/routing/RoutingPage'))
const RoutingHome = lazy(() => import('./pages/routing/RoutingHome'))
const UserList = lazy(() => import('./pages/routing/UserList'))
const UserDetail = lazy(() => import('./pages/routing/UserDetail'))
const LoginPage = lazy(() => import('./pages/routing/LoginPage'))
const SecretPage = lazy(() => import('./pages/routing/SecretPage'))
const TodoPage = lazy(() => import('./pages/TodoPage'))

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="bg-white p-4 md:w-64 md:shrink-0 md:border-r md:border-slate-200">
        <h1 className="mb-4 text-xl font-bold text-sky-600">React Lessons</h1>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {/* NavLink changes the page without reloading and knows if it is active */}
          {lessons.map((lesson) => (
            <NavLink
              key={lesson.path}
              to={lesson.path}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm hover:bg-slate-100 ${
                  isActive ? 'bg-sky-100 font-semibold text-sky-800' : ''
                }`
              }
            >
              {lesson.title}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="max-w-3xl flex-1 space-y-4 p-4 md:p-8">
        {/* Suspense shows the fallback while a lazy page is loading */}
        <Suspense fallback={<p>Loading page...</p>}>
          {/* The first matching <Route> renders its element here */}
          <Routes>
            <Route path="/" element={<Navigate to="/template" replace />} />
            <Route path="/template" element={<TemplatePage />} />
            <Route path="/state" element={<StatePage />} />
            <Route path="/conditional" element={<ConditionalPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/computed" element={<ComputedPage />} />
            <Route path="/effect" element={<EffectPage />} />
            <Route path="/components" element={<ComponentsPage />} />
            <Route path="/ref" element={<RefPage />} />
            <Route path="/composable" element={<ComposablePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/api" element={<ApiPage />} />

            {/* Nested routes: these render inside the <Outlet /> of RoutingPage */}
            <Route path="/routing" element={<RoutingPage />}>
              <Route index element={<RoutingHome />} />
              <Route path="users" element={<UserList />} />
              {/* ":id" is a dynamic segment, read it with useParams() */}
              <Route path="users/:id" element={<UserDetail />} />
              <Route path="login" element={<LoginPage />} />
              {/* a route without a path that guards its children */}
              <Route element={<ProtectedRoute />}>
                <Route path="secret" element={<SecretPage />} />
              </Route>
            </Route>

            <Route path="/todo" element={<TodoPage />} />
            {/* Catch-all: 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
