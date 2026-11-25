// Express has no database layer. Here we use Node's built-in SQLite with plain SQL.
// Real projects usually add an ORM: Prisma, Drizzle or Sequelize.
import { DatabaseSync } from 'node:sqlite'
import { config } from './config.js'

export const db = new DatabaseSync(config.dbFile)

// Create the table (an ORM would do this with a "migration")
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    title  TEXT    NOT NULL,
    author TEXT    NOT NULL,
    year   INTEGER
  )
`)

// Seed: add sample rows if the table is empty
const { count } = db.prepare('SELECT COUNT(*) AS count FROM books').get()
if (count === 0) {
  const insert = db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)')
  insert.run('Clean Code', 'Robert C. Martin', 2008)
  insert.run('The Pragmatic Programmer', 'Andy Hunt', 1999)
}
