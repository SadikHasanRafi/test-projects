# Express: the reference app

Every other app in this repo copies this one. Read it first, then compare.

## Run

```bash
cd express-app
pnpm install
pnpm dev          # http://localhost:4000, restarts when you save
```

Optional: `cp .env.example .env` to change the port or token.

## Folder structure

```
src/
├── server.js            starts the server (app.listen)
├── app.js               builds the app: middleware → routes → 404 → error handler
├── config.js            reads environment variables
├── db.js                opens SQLite, creates the table, adds sample rows
├── routes/              URL + method → controller function
├── controllers/         read request → call model → send response
├── models/              all SQL for books
├── validators/          zod schemas
└── middleware/          logger, auth, validate, error handlers
```

## Request flow

```
request → express.json() → requestLogger → /books router
        → requireToken → validate(bookSchema) → controller → model → res.json()
no route matched → notFound      something threw → errorHandler
```

## The 10 concepts

The same numbers are used in every README, so you can jump between them.

| # | Concept | In this app |
| --- | --- | --- |
| 1 | Create and start the app | `express()` in [app.js](src/app.js), `app.listen()` in [server.js](src/server.js) |
| 2 | Routes | `router.get('/', fn)` in [books.routes.js](src/routes/books.routes.js), mounted with `app.use('/books', router)` |
| 3 | URL params and query | `req.params.id`, `req.query.author` in [books.controller.js](src/controllers/books.controller.js) |
| 4 | Body validation | zod schema + `validate()` middleware |
| 5 | Middleware | `(req, res, next) => {}` in [logger.js](src/middleware/logger.js) |
| 6 | Auth | `requireToken` middleware, added per route |
| 7 | Errors and 404 | `notFound` + 4-argument `errorHandler` in [errorHandler.js](src/middleware/errorHandler.js) |
| 8 | Database | plain SQL with `node:sqlite` in [book.model.js](src/models/book.model.js) |
| 9 | Config | `process.env` in [config.js](src/config.js), loaded by `node --env-file` |
| 10 | Structure and dependency injection (DI) | your own folders; no DI, you just `import` |

## What Express does not decide for you

Express is minimal on purpose. You pick each of these yourself:

- **Validation:** zod, joi or express-validator
- **Database:** Prisma, Drizzle or Sequelize (here: raw SQL)
- **Folder structure:** the folders above are a convention, nothing enforces them
- **Dependency injection:** none, modules import each other

Most of the other frameworks make these choices for you. That's the biggest difference you'll notice.
