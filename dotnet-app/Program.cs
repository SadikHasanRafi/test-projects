// Entry point (like app.js + server.js). Top-level code, no Main() needed.
using BooksApi.Data;
using BooksApi.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Register services in the dependency injection (DI) container
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddProblemDetails(); // standard JSON format for errors

var app = builder.Build();

// 2. Create the database and seed data if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // real projects use migrations: dotnet ef migrations add Init
}

// 3. Middleware pipeline, runs in this order (like app.use)
app.UseMiddleware<RequestLoggerMiddleware>();
app.UseExceptionHandler(); // unhandled exception -> 500 JSON

// 4. Routes
// "Minimal API" style: the closest thing to Express
app.MapGet("/", () => new { message = "Hello from ASP.NET Core" });

// Controller style: finds every class in Controllers/
app.MapControllers();

// Nothing matched -> 404 (like app.use(notFound))
app.MapFallback(() => Results.NotFound(new { error = "Route not found" }));

app.Run();
