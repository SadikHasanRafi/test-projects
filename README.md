# Backend frameworks for Express developers

The **same small Books API**, built 7 times. Start with Express, which you already know, then read any other app next to it.

| Folder | Framework | Language | Port | Start command |
| --- | --- | --- | --- | --- |
| [express-app](express-app/) | Express 5 (reference) | JavaScript | 4000 | `pnpm install && pnpm dev` |
| [fastify-app](fastify-app/) | Fastify 5 | JavaScript | 4001 | `pnpm install && pnpm dev` |
| [nestjs-app](nestjs-app/) | NestJS 12 | TypeScript | 4002 | `pnpm install && pnpm start:dev` |
| [fastapi-app](fastapi-app/) | FastAPI | Python | 4003 | `uv sync && uv run fastapi dev app/main.py --port 4003` |
| [django-app](django-app/) | Django 6 + DRF | Python | 4004 | `uv sync && uv run python manage.py migrate && uv run python manage.py runserver 4004` |
| [laravel-app](laravel-app/) | Laravel 13 | PHP | 4005 | `composer run setup && composer run dev` |
| [dotnet-app](dotnet-app/) | ASP.NET Core 10 | C# | 4006 | `dotnet run` |

You need: Node 22+ and pnpm · Python 3.12+ and [uv](https://docs.astral.sh/uv/) · PHP 8.3+ and Composer ([php.new](https://php.new)) · [.NET 10 SDK](https://dotnet.microsoft.com/download).

## The API (identical in every app)

| Method | Path | Auth | Result |
| --- | --- | --- | --- |
| GET | `/` | | `{ "message": "Hello from <framework>" }` |
| GET | `/books?author=martin` | | list, optional filter |
| GET | `/books/:id` | | one book, or 404 |
| POST | `/books` | ✔ | 201 + the new book |
| PUT | `/books/:id` | ✔ | the updated book |
| DELETE | `/books/:id` | ✔ | 204 |
| any | unknown path | | 404 JSON |

- **Book:** `{ id, title, author, year }`. `title` and `author` are required, 1–100 characters. `year` is optional, an integer from 0 to 2100.
- **Auth:** send the header `Authorization: Bearer secret123`. Change the token with the `API_TOKEN` env var.
- **Database:** SQLite, created on first run with 2 sample books.
- **Every app logs requests** like `GET /books 200 3ms`.

## How to study

1. Run [express-app](express-app/) and read its README. It's the baseline.
2. Pick another framework and open its README. Each concept is shown as **Express → that framework**.
3. Open the matching files side by side. Every README uses the same 10 numbered concepts:

   | Beginner | Mid-level |
   | --- | --- |
   | 1. Create and start the app | 6. Auth |
   | 2. Routes | 7. Errors and 404 |
   | 3. URL params and query | 8. Database, ORM and migrations |
   | 4. Body validation | 9. Config and env |
   | 5. Middleware | 10. Structure and dependency injection |

4. Use [COMPARISON.md](COMPARISON.md) as a one-page cheat sheet across all 7.
5. Send requests with [api.http](api.http) (VS Code "REST Client" extension), or run the test script:

   ```bash
   node test-api.mjs 4003     # checks every endpoint of the app on port 4003
   ```

A suggested order, from most to least like Express: **Fastify → NestJS → FastAPI → Django → Laravel → ASP.NET Core**.

## Exercises

Do each one in Express first, then in the framework you're learning.

1. Add `GET /books/count` that returns `{ "count": 2 }`.
2. Add a `pages` field (optional, positive integer) to the model, validation and database.
3. Add pagination: `GET /books?page=2&limit=10`.
4. Return 409 if a book with the same title already exists.
5. Move the "Book not found" logic into a shared helper or exception.
