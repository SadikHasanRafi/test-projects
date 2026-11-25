// No route matched
export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' })
}

// 4 arguments = error handler. Called by next(err) or a thrown error.
// Express 5 also catches errors thrown in async handlers.
export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500 // e.g. express.json() sets 400 for bad JSON
  if (status === 500) console.error(err)
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message })
}
