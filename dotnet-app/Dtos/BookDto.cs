using System.ComponentModel.DataAnnotations;

namespace BooksApi.Dtos;

// DTO: the request body and its validation rules (like a zod schema).
// [ApiController] checks these and returns 400 if invalid.
public record BookDto(
    [Required, StringLength(100, MinimumLength = 1)] string Title,
    [Required, StringLength(100, MinimumLength = 1)] string Author,
    [Range(0, 2100)] int? Year
);
