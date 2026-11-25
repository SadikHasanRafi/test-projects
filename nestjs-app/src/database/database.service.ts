// Opens SQLite (Node's built-in driver, same as the Express app).
// Real NestJS projects usually use TypeORM or Prisma here.
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseSync } from 'node:sqlite';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  readonly db: DatabaseSync;

  constructor(config: ConfigService) {
    this.db = new DatabaseSync(config.get('DB_FILE', 'database.sqlite'));
  }

  // Lifecycle hook: runs once when the module starts
  onModuleInit() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        title  TEXT    NOT NULL,
        author TEXT    NOT NULL,
        year   INTEGER
      )
    `);
    const { count } = this.db.prepare('SELECT COUNT(*) AS count FROM books').get() as { count: number };
    if (count === 0) {
      const insert = this.db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)');
      insert.run('Clean Code', 'Robert C. Martin', 2008);
      insert.run('The Pragmatic Programmer', 'Andy Hunt', 1999);
    }
  }

  onModuleDestroy() {
    this.db.close();
  }
}
