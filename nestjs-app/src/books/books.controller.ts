// Controller: routes are methods, described with decorators.
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books') // every route here starts with /books
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // GET /books?author=martin
  @Get()
  findAll(@Query('author') author?: string) {
    return this.booksService.findAll(author);
  }

  // GET /books/:id   ParseIntPipe turns "5" into 5 (400 if not a number)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  // POST /books   (POST returns 201 by default)
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  // PUT /books/:id
  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateBookDto) {
    return this.booksService.update(id, dto);
  }

  // DELETE /books/:id
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.booksService.remove(id);
  }
}
