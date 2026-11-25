// Feature module: groups the controller and service for books.
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [DatabaseModule], // makes DatabaseService injectable here
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
