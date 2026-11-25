import Fastify from 'fastify'
import { config } from './config.js'
import authPlugin from './plugins/auth.js'
import dbPlugin from './plugins/db.js'
import booksRoutes from './routes/books.routes.js'

export function buildApp() {
  // logger: true would turn on Fastify's built-in JSON logger (pino).
  // We write our own below to show hooks.
  const app = Fastify()

  // 1. Plugins: Fastify's way to add features (like app.use, but encapsulated)
  app.register(dbPlugin, { file: config.dbFile })
  app.register(authPlugin, { token: config.apiToken })

  // 2. Hooks: Fastify's version of middleware. onResponse = after the reply is sent
  app.addHook('onResponse', async (request, reply) => {
    console.log(`${request.method} ${request.url} ${reply.statusCode} ${Math.round(reply.elapsedTime)}ms`)
  })

  // 3. Routes. Return a value instead of calling res.json()
  app.get('/', async () => ({ message: 'Hello from Fastify' }))
  app.register(booksRoutes, { prefix: '/books' })

  // 4. 404 and error handlers
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: 'Route not found' })
  })
  app.setErrorHandler((error, request, reply) => {
    const status = error.statusCode ?? 500 // validation errors are 400
    if (status === 500) console.error(error)
    reply.code(status).send({ error: status === 500 ? 'Internal server error' : error.message })
  })

  return app
}
