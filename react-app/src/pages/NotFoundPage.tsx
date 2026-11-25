import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <>
      <h2 className="text-3xl font-bold">404</h2>
      <p>Page not found.</p>
      <Link to="/" className="text-blue-600 underline">Go home</Link>
    </>
  )
}
