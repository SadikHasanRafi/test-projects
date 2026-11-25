// Routes: map URL + method to controller functions. Mounted at /books in app.js
import { Router } from 'express'
import * as books from '../controllers/books.controller.js'
import { requireToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { bookSchema } from '../validators/book.schema.js'

const router = Router()

router.get('/', books.getBooks)
router.get('/:id', books.getBook)

// Middleware run left to right: auth -> validation -> controller
router.post('/', requireToken, validate(bookSchema), books.createBook)
router.put('/:id', requireToken, validate(bookSchema), books.updateBook)
router.delete('/:id', requireToken, books.deleteBook)

export default router
