// Routes plugin, registered with prefix /books in app.js
import { bookBody, idParams, listQuery } from '../schemas/book.schema.js'

export default async function booksRoutes(fastify) {
  // onRequest hook runs first, before the body is even parsed
  const protect = { onRequest: fastify.requireToken }

  // GET /books?author=martin
  fastify.get('/', { schema: { querystring: listQuery } }, async (request) => {
    return fastify.books.findAll(request.query.author)
  })

  // GET /books/:id
  fastify.get('/:id', { schema: { params: idParams } }, async (request, reply) => {
    const book = fastify.books.findById(request.params.id)
    if (!book) return reply.code(404).send({ error: 'Book not found' })
    return book
  })

  // POST /books
  fastify.post('/', { ...protect, schema: { body: bookBody } }, async (request, reply) => {
    return reply.code(201).send(fastify.books.create(request.body))
  })

  // PUT /books/:id
  fastify.put('/:id', { ...protect, schema: { params: idParams, body: bookBody } }, async (request, reply) => {
    const book = fastify.books.update(request.params.id, request.body)
    if (!book) return reply.code(404).send({ error: 'Book not found' })
    return book
  })

  // DELETE /books/:id
  fastify.delete('/:id', { ...protect, schema: { params: idParams } }, async (request, reply) => {
    if (!fastify.books.remove(request.params.id)) {
      return reply.code(404).send({ error: 'Book not found' })
    }
    return reply.code(204).send()
  })
}
