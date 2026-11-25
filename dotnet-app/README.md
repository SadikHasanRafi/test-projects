# ASP.NET Core for Express developers

Microsoft's web framework, in C#. It's strongly typed, fast, and has dependency injection, configuration and logging built in.

## Run

Needs the [.NET 10 SDK](https://dotnet.microsoft.com/download).

```bash
cd dotnet-app
dotnet run          # http://localhost:4006  (restores packages on first run)
dotnet watch        # same, with hot reload
```

## Folder structure

```
Program.cs                          app.js + server.js
appsettings.json                    .env + config.js
BooksApi.csproj                     package.json
Controllers/BooksController.cs      routes/ + controllers/
Dtos/BookDto.cs                     validators/
Models/Book.cs                      the Book shape
Data/AppDbContext.cs                db.js (EF Core)
Middleware/RequestLoggerMiddleware  middleware/logger.js
Filters/RequireTokenAttribute       middleware/auth.js
```

## Side by side

### 1. Create and start: two phases

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();     // phase 1: register services (DI)

var app = builder.Build();
app.UseMiddleware<RequestLoggerMiddleware>();   // phase 2: middleware + routes
app.MapControllers();
app.Run();
```

### 2. Routes: two styles

```csharp
// Minimal API: the closest to Express
app.MapGet("/", () => new { message = "Hi" });

// Controllers: classes with attributes (used for books)
[Route("books")]
public class BooksController : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Book>> GetOne(int id) { ... }
}
```

### 3. URL params and query come from method parameters

```csharp
GetOne(int id)                          // {id:int} in the route → URL param
GetAll([FromQuery] string? author)      // ?author=
```

### 4. Body validation: DTO + attributes

```csharp
public record BookDto(
    [Required, StringLength(100, MinimumLength = 1)] string Title, ...);

public async Task<ActionResult<Book>> Create(BookDto dto)   // body → dto
```

`[ApiController]` returns a 400 automatically when the DTO is invalid.

### 5. Middleware

```csharp
public async Task InvokeAsync(HttpContext context)
{
    await next(context);    // next()
}
```

`app.UseMiddleware<T>()` is `app.use()`. As in Express, **order matters**.

### 6. Auth

```csharp
[HttpPost]
[RequireToken]       // a filter attribute, runs before validation
```

Real apps use `builder.Services.AddAuthentication().AddJwtBearer()` and `[Authorize]`.

### 7. Errors and 404

```csharp
return NotFound(new { error = "Book not found" });   // res.status(404).json(...)
return NoContent();                                  // 204
app.UseExceptionHandler();                           // global error handler
app.MapFallback(...);                                // app.use(notFound)
```

### 8. Database: Entity Framework Core

```csharp
await db.Books.FindAsync(id);
await db.Books.Where(b => b.Author.Contains("Martin")).ToListAsync();   // LINQ → SQL
db.Books.Add(book); await db.SaveChangesAsync();
```

`EnsureCreated()` makes the tables here. Real projects use migrations:
`dotnet tool install -g dotnet-ef`, then `dotnet ef migrations add Init` and `dotnet ef database update`.

### 9. Config

`appsettings.json` is overridden by environment variables (`ApiToken=abc dotnet run`). Read values with `IConfiguration`: `config["ApiToken"]`.

### 10. Dependency injection: built in

```csharp
builder.Services.AddDbContext<AppDbContext>(...);      // register
public class BooksController(AppDbContext db)          // receive it in the constructor
```

Lifetimes: `AddSingleton` (one for the whole app), `AddScoped` (one per request), `AddTransient` (new every time).

## `async` / `await`

Same idea as JavaScript: `Task<T>` is C#'s `Promise<T>`.

## Gotchas

- Register services **before** `builder.Build()`.
- Middleware order matters: the logger is first so it sees the final status code.
- `DbContext` is per request (scoped). Don't keep it in a singleton.
- A route without `{id:int}` would also match `/books/abc` and then fail to convert.

## Learn next

EF Core migrations and relationships, JWT auth with `[Authorize]`, OpenAPI (`AddOpenApi()`), and integration tests with `WebApplicationFactory`.
