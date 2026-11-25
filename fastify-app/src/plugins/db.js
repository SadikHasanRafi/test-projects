// Plugin: opens the database and adds `fastify.books` for all routes to use.
import fp from 'fastify-plugin'
import { DatabaseSync } from 'node:sqlite'
import { bookModel } from '../models/book.model.js'

async function dbPlugin(fastify, options) {
  const db = new DatabaseSync(options.file)

  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      title  TEXT    NOT NULL,
      author TEXT    NOT NULL,
      year   INTEGER
    )
  `)
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM books').get()
  if (count === 0) {
    const insert = db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)')
    insert.run('Clean Code', 'Robert C. Martin', 2008)
    insert.run('The Pragmatic Programmer', 'Andy Hunt', 1999)
  }

  // decorate = attach something to the fastify instance
  fastify.decorate('books', bookModel(db))
  fastify.addHook('onClose', async () => db.close())
}

// fp() makes the decoration visible outside this plugin (no encapsulation)
export default fp(dbPlugin)
