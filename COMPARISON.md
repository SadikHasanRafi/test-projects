# Cheat sheet: Express vs the rest

Read across a row to see how one idea is written in each framework. For explanations and code, open each app's README.

## Big picture

| | Express | Fastify | NestJS | FastAPI | Django + DRF | Laravel | ASP.NET Core |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Language | JS | JS | TypeScript | Python | Python | PHP | C# |
| Style | minimal | minimal + plugins | structured, Angular-like | minimal + type hints | batteries included | batteries included | full framework |
| You choose | almost everything | ORM, structure | ORM | ORM | very little | very little | very little |
| Package manager | npm/pnpm | npm/pnpm | npm/pnpm | uv/pip | uv/pip | composer | dotnet/NuGet |
| Dev server | `node --watch` | `node --watch` | `nest start --watch` | `fastapi dev` | `manage.py runserver` | `artisan serve` | `dotnet watch` |

## 1–4. Routes, params and validation

| | Express | Fastify | NestJS | FastAPI | Django + DRF | Laravel | ASP.NET Core |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Define a route | `app.get(path, fn)` | `app.get(path, opts, fn)` | `@Get()` on a method | `@router.get()` on a function | `path()` in urls.py | `Route::get()` | `[HttpGet]` or `app.MapGet()` |
| Group under /books | `app.use('/books', router)` | `register(plugin, { prefix })` | `@Controller('books')` | `APIRouter(prefix=...)` | `include()` | `Route::prefix()` | `[Route("books")]` |
| URL param | `req.params.id` | `request.params.id` | `@Param('id')` | argument `book_id: int` | `<int:pk>` → `pk` | `{book}` → `Book $book` | `{id:int}` → `int id` |
| Query | `req.query.author` | `request.query.author` | `@Query('author')` | argument with a default | `request.query_params` | `$request->query()` | `[FromQuery]` |
| Body | `req.body` | `request.body` | `@Body() dto` | model argument | `request.data` | `$request->validated()` | DTO argument |
| Validation | zod (add-on) | JSON Schema (built in) | class-validator DTO | Pydantic (built in) | Serializer | FormRequest | DataAnnotations |
| Invalid body | 400 (your choice) | 400 | 400 | **422** | 400 | **422** | 400 |
| Send JSON | `res.json(x)` | `return x` | `return x` | `return x` | `Response(x)` | `return $x` | `return x` |
| Set status | `res.status(201)` | `reply.code(201)` | `@HttpCode(201)` | `status_code=201` | `Response(..., status=201)` | `response()->json($x, 201)` | `CreatedAtAction()`, `NoContent()` |

## 5–7. Middleware, auth and errors

| | Express | Fastify | NestJS | FastAPI | Django + DRF | Laravel | ASP.NET Core |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Global middleware | `app.use(fn)` | `addHook('onRequest', fn)` | `consumer.apply()` | `@app.middleware("http")` | `MIDDLEWARE` list | `$middleware->append()` | `app.UseMiddleware<T>()` |
| "Call the next one" | `next()` | return from hook | `next()` | `await call_next(request)` | `get_response(request)` | `$next($request)` | `await next(context)` |
| Protect a route | middleware argument | `onRequest` hook | Guard + `@UseGuards` | `Depends(require_token)` | auth + permission classes | route middleware | filter attribute / `[Authorize]` |
| Send an error | `res.status(404).json()` | `reply.code(404).send()` | `throw new NotFoundException()` | `raise HTTPException(404)` | `raise NotFound()` | `abort(404)`, `findOrFail()` | `return NotFound()` |
| Global error handler | `(err, req, res, next)` | `setErrorHandler()` | exception filter | `@app.exception_handler` | `EXCEPTION_HANDLER` setting | `withExceptions()` | `UseExceptionHandler()` |
| Unknown route | `app.use(notFound)` last | `setNotFoundHandler()` | built in | built in | catch-all `re_path` | `Route::fallback()` | `MapFallback()` |
| Real-world auth | passport / JWT | `@fastify/jwt` | `@nestjs/jwt` + Passport | OAuth2 + JWT helpers | simplejwt | Sanctum | JWT Bearer + `[Authorize]` |

## 8–10. Database, config and structure

| | Express | Fastify | NestJS | FastAPI | Django + DRF | Laravel | ASP.NET Core |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ORM | none (Prisma, Drizzle) | none | TypeORM / Prisma | SQLModel / SQLAlchemy | Django ORM (built in) | Eloquent (built in) | EF Core |
| Find by id | `findById(id)` (SQL here) | same | service method | `session.get(Book, id)` | `Book.objects.get(pk=id)` | `Book::find($id)` | `db.Books.FindAsync(id)` |
| Filter | SQL `LIKE` | SQL `LIKE` | SQL `LIKE` | `select(Book).where()` | `.filter(author__icontains=)` | `->where('author', 'like', ...)` | LINQ `.Where()` |
| Migrations | the ORM's tool | the ORM's tool | the ORM's tool | Alembic | `makemigrations` + `migrate` | `artisan migrate` | `dotnet ef` |
| Config | `process.env` | `process.env` | `ConfigService` | pydantic-settings | `settings.py` | `.env` → `config()` | `appsettings.json` + `IConfiguration` |
| Dependency injection | none (import) | `decorate()` + plugins | built in (providers) | `Depends()` | none | service container | built in |
| Code generator | none | none | `nest g resource` | none | `startapp` | `artisan make:*` | `dotnet new` |
| API docs | add-on | `@fastify/swagger` | `@nestjs/swagger` | **built in** (`/docs`) | drf-spectacular | Scramble | `AddOpenApi()` |
| Testing | supertest | `app.inject()` | `@nestjs/testing` | `TestClient` + pytest | `APITestCase` | `php artisan test` | `WebApplicationFactory` |

## Where the code lives

| | Express | Fastify | NestJS | FastAPI | Django | Laravel | ASP.NET Core |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entry | `src/server.js` | `src/server.js` | `src/main.ts` | `app/main.py` | `manage.py` | `public/index.php` | `Program.cs` |
| App setup | `src/app.js` | `src/app.js` | `src/app.module.ts` | `app/main.py` | `config/settings.py` | `bootstrap/app.php` | `Program.cs` |
| Routes | `routes/` | `routes/` | controller decorators | `routers/` | `urls.py` | `routes/api.php` | controller attributes |
| Handlers | `controllers/` | `routes/` | `*.controller.ts` | `routers/` | `views.py` | `Http/Controllers/` | `Controllers/` |
| Validation | `validators/` | `schemas/` | `dto/` | `models.py` | `serializers.py` | `Http/Requests/` | `Dtos/` |
| Database | `models/` | `models/` | `*.service.ts` | `models.py` | `models.py` | `Models/` | `Data/` + `Models/` |

## Request flow

```
Express   middleware → route middleware (auth, validate) → controller → res.json
Fastify   onRequest (auth) → parse → validate (schema) → preHandler → handler → onSend → onResponse
NestJS    middleware → guard (auth) → pipe (validate) → controller → service → exception filter
FastAPI   middleware → dependencies (auth, db session) → validate (Pydantic) → route function
Django    middleware → urls.py → view → authentication + permission → serializer → Response
Laravel   global middleware → route middleware (auth) → FormRequest (validate) → controller
ASP.NET   middleware pipeline → routing → filters (auth) → model binding + validation → action
```
