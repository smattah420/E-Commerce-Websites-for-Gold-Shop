import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="glass rounded-2xl p-8">
      <h1 className="text-3xl">Page not found</h1>
      <p className="mt-2 text-sm text-white/65">
        The page you’re looking for doesn’t exist.
      </p>
      <div className="mt-6">
        <Link className="btn btn-gold" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

