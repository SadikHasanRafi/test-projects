using BooksApi.Data;
using BooksApi.Dtos;
using BooksApi.Filters;
using BooksApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksApi.Controllers;

[ApiController]   // automatic 400 for invalid bodies, [FromBody] by default
[Route("books")]  // every route here starts with /books
public class BooksController(AppDbContext db) : ControllerBase // db comes from DI
{
    // GET /books?author=martin
    [HttpGet]
    public async Task<List<Book>> GetAll([FromQuery] string? author)
    {
        var query = db.Books.AsQueryable();
        if (!string.IsNullOrEmpty(author))
        {
            query = query.Where(b => EF.Functions.Like(b.Author, $"%{author}%"));
        }
        return await query.ToListAsync();
    }

    // GET /books/5   ({id:int} = only matches numbers)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Book>> GetOne(int id)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null) return NotFound(new { error = "Book not found" });
        return book;
    }

    // POST /books
    [HttpPost]
    [RequireToken]
    public async Task<ActionResult<Book>> Create(BookDto dto)
    {
        var book = new Book { Title = dto.Title, Author = dto.Author, Year = dto.Year };
        db.Books.Add(book);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOne), new { id = book.Id }, book); // 201
    }

    // PUT /books/5
    [HttpPut("{id:int}")]
    [RequireToken]
    public async Task<ActionResult<Book>> Update(int id, BookDto dto)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null) return NotFound(new { error = "Book not found" });

        book.Title = dto.Title;
        book.Author = dto.Author;
        book.Year = dto.Year;
        await db.SaveChangesAsync(); // EF Core tracks the changes and writes an UPDATE
        return book;
    }

    // DELETE /books/5
    [HttpDelete("{id:int}")]
    [RequireToken]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null) return NotFound(new { error = "Book not found" });

        db.Books.Remove(book);
        await db.SaveChangesAsync();
        return NoContent(); // 204
    }
}
