# Fastify for Express developers

The closest framework to Express: also JavaScript and also minimal, but faster, with validation built in and a plugin system.

## Run

```bash
cd fastify-app
pnpm install
pnpm dev          # http://localhost:4001
```

## Folder structure

```
src/                          Express equivalent
├── server.js                 server.js
├── app.js                    app.js
├── config.js                 config.js
├── plugins/db.js             db.js, as a plugin
├── plugins/auth.js           middleware/auth.js, as a plugin
├── models/book.model.js      models/book.model.js
├── schemas/book.schema.js    validators/ (JSON Schema instead of zod)
└── routes/books.routes.js    routes/ + controllers/ together
```

## Side by side

### 1. Create and start

```js
// Express
const app = express()
app.listen(4000)

// Fastify
const app = Fastify()
await app.listen({ port: 4001 })
```

### 2. Routes

Return the value instead of calling `res.json()`.

```js
// Express
app.get('/', (req, res) => res.json({ message: 'hi' }))
res.status(201).json(book)
app.use('/books', booksRouter)

// Fastify
app.get('/', async () => ({ message: 'hi' }))
reply.code(201).send(book)
app.register(booksRoutes, { prefix: '/books' })
```

### 3. URL params and query

The same names: `request.params.id` and `request.query.author`. With a schema, `id` is already a number.

### 4. Body validation: built in

There's no zod. You add a JSON Schema to the route options.

```js
fastify.post('/', { schema: { body: bookBody } }, handler)
```

An invalid body gets a 400 automatically. See [book.schema.js](src/schemas/book.schema.js).

### 5. Middleware → hooks

```js
// Express
app.use((req, res, next) => { ...; next() })

// Fastify: pick the moment in the request
app.addHook('onResponse', async (request, reply) => { ... })
```

Order: `onRequest → preParsing → preValidation → preHandler → handler → onSend → onResponse`

### 6. Auth

```js
// Express: middleware as a route argument
router.post('/', requireToken, validate(bookSchema), createBook)

// Fastify: a hook in the route options
fastify.post('/', { onRequest: fastify.requireToken, schema: { body: bookBody } }, handler)
```

### 7. Errors and 404

```js
app.setNotFoundHandler((request, reply) => reply.code(404).send({ error: 'Route not found' }))
app.setErrorHandler((error, request, reply) => { ... })   // like (err, req, res, next)
```

### 8. Database

The same SQL as Express. It's wrapped in a **plugin** that attaches the model to the app with `fastify.decorate('books', ...)`. Routes then use `fastify.books.findAll()`.

### 9. Config

The same as Express: `process.env` with `node --env-file`.

### 10. Plugins = structure and DI

`app.register(plugin)` creates an isolated scope. Anything it decorates is only visible inside it, unless you wrap the plugin with `fastify-plugin` (`fp`). This is how Fastify shares things like the database across the app.

## Gotchas

- A DELETE sent with `Content-Type: application/json` but **no body** gets a 400. Don't send that header without a body.
- In an `async` handler, either `return value` or `return reply.send(value)`. Never do both.
- A decorator is not visible in other plugins unless its plugin is wrapped in `fp()`.

## Learn next

`@fastify/swagger` (API docs), response schemas (faster JSON), TypeBox (typed schemas), `@fastify/jwt`, and `app.inject()` for tests.
