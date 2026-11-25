namespace BooksApi.Models;

// Entity: one row of the Books table (EF Core maps it by convention)
public class Book
{
    public int Id { get; set; } // "Id" becomes the primary key automatically
    public string Title { get; set; } = "";
    public string Author { get; set; } = "";
    public int? Year { get; set; } // int? = may be null
}
