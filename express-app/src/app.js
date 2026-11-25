import express from 'express'
import { requestLogger } from './middleware/logger.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import booksRouter from './routes/books.routes.js'

const app = express()

// 1. Global middleware: runs for every request, in this order
app.use(express.json()) // parse JSON bodies into req.body
app.use(requestLogger)

// 2. Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express' })
})
app.use('/books', booksRouter) // every route in booksRouter starts with /books

// 3. Nothing matched -> 404. Then the error handler (must be last)
app.use(notFound)
app.use(errorHandler)

export default app
