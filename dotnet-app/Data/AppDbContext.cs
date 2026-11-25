using BooksApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BooksApi.Data;

// DbContext: your connection to the database. Each DbSet is a table.
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(book =>
        {
            book.Property(b => b.Title).HasMaxLength(100);
            book.Property(b => b.Author).HasMaxLength(100);

            // Seed data, inserted when the database is created
            book.HasData(
                new Book { Id = 1, Title = "Clean Code", Author = "Robert C. Martin", Year = 2008 },
                new Book { Id = 2, Title = "The Pragmatic Programmer", Author = "Andy Hunt", Year = 1999 }
            );
        });
    }
}
