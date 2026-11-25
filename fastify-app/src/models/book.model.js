// Model: the only code that talks to the database about books.
// Same SQL as the Express app. It receives the db instead of importing it.
export const bookModel = (db) => ({
  findAll(author) {
    if (author) {
      return db.prepare('SELECT * FROM books WHERE author LIKE ?').all(`%${author}%`)
    }
    return db.prepare('SELECT * FROM books').all()
  },

  findById(id) {
    return db.prepare('SELECT * FROM books WHERE id = ?').get(id)
  },

  create({ title, author, year = null }) {
    const result = db
      .prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)')
      .run(title, author, year)
    return this.findById(result.lastInsertRowid)
  },

  update(id, { title, author, year = null }) {
    const result = db
      .prepare('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?')
      .run(title, author, year, id)
    return result.changes > 0 ? this.findById(id) : undefined
  },

  remove(id) {
    return db.prepare('DELETE FROM books WHERE id = ?').run(id).changes > 0
  },
})
