// Service: business logic and database access. Controllers stay thin.
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable() // can be injected into other classes
export class BooksService {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  findAll(author?: string): Book[] {
    if (author) {
      return this.db.prepare('SELECT * FROM books WHERE author LIKE ?').all(`%${author}%`) as unknown as Book[];
    }
    return this.db.prepare('SELECT * FROM books').all() as unknown as Book[];
  }

  findOne(id: number): Book {
    const book = this.db.prepare('SELECT * FROM books WHERE id = ?').get(id) as Book | undefined;
    // Throwing an HttpException is the Nest way to send an error response
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  create({ title, author, year = null }: CreateBookDto): Book {
    const result = this.db
      .prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)')
      .run(title, author, year);
    return this.findOne(Number(result.lastInsertRowid));
  }

  update(id: number, { title, author, year = null }: CreateBookDto): Book {
    this.findOne(id); // 404 if missing
    this.db.prepare('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?').run(title, author, year, id);
    return this.findOne(id);
  }

  remove(id: number): void {
    this.findOne(id);
    this.db.prepare('DELETE FROM books WHERE id = ?').run(id);
  }
}
