// Logs: GET /books 200 3ms
export function requestLogger(req, res, next) {
  const start = Date.now()
  // 'finish' fires after the response is sent, so we know the status code
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`)
  })
  next() // pass control to the next middleware/route
}
