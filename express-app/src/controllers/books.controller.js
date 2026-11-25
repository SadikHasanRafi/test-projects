// Controller: reads the request, calls the model, sends the response.
import { Book } from '../models/book.model.js'

// GET /books?author=martin
export function getBooks(req, res) {
  res.json(Book.findAll(req.query.author))
}

// GET /books/:id
export function getBook(req, res) {
  const book = Book.findById(Number(req.params.id))
  if (!book) return res.status(404).json({ error: 'Book not found' })
  res.json(book)
}

// POST /books
export function createBook(req, res) {
  const book = Book.create(req.body)
  res.status(201).json(book)
}

// PUT /books/:id
export function updateBook(req, res) {
  const book = Book.update(Number(req.params.id), req.body)
  if (!book) return res.status(404).json({ error: 'Book not found' })
  res.json(book)
}

// DELETE /books/:id
export function deleteBook(req, res) {
  const deleted = Book.remove(Number(req.params.id))
  if (!deleted) return res.status(404).json({ error: 'Book not found' })
  res.status(204).end()
}
