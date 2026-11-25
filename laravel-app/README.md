# Laravel for Express developers

PHP's most popular framework. It's "batteries included" like Django: Eloquent ORM, migrations, validation, queues and mail, plus a CLI (`artisan`) that generates code for you.

## Run

Needs PHP 8.3+ and Composer. The quickest install is [php.new](https://php.new).

```bash
cd laravel-app
composer run setup     # install, create .env + app key, create SQLite DB, migrate + seed
composer run dev       # http://localhost:4005
```

Logs go to `storage/logs/laravel.log`. Watch them live with `php artisan pail`.

## Folder structure

Laravel's skeleton has many files. These are the ones that matter here:

```
bootstrap/app.php                      app.js: routing, middleware, errors
routes/api.php                         routes/
app/Http/Controllers/BookController    controllers/
app/Http/Requests/BookRequest          validators/
app/Http/Middleware/LogRequest         middleware/logger.js
app/Http/Middleware/CheckApiToken      middleware/auth.js
app/Models/Book.php                    models/
database/migrations/..._create_books   CREATE TABLE in db.js
database/seeders/DatabaseSeeder        sample rows in db.js
config/app.php (api_token)             config.js
.env                                   .env
public/index.php                       server.js (every request starts here)
artisan                                CLI: serve, migrate, make:*, tinker
```

The users, cache and jobs tables are Laravel defaults. You can ignore them.

## Side by side

### 1. Create and start

`bootstrap/app.php` configures the app. `php artisan serve` starts a dev server.

### 2. Routes

```php
// Express: router.get('/:id', getBook)
Route::get('/books/{book}', [BookController::class, 'show']);

Route::get('/', fn () => ['message' => 'Hi']);   // arrays → JSON
```

`Route::apiResource('books', BookController::class)` creates all 5 book routes in one line.

### 3. URL params and query: route model binding

```php
// Express: Book.findById(req.params.id), then a 404 check
public function show(Book $book) { return $book; }   // Laravel loads it, or sends 404

$request->query('author');                           // req.query.author
```

### 4. Body validation: Form Requests

```php
class BookRequest extends FormRequest {
    public function rules(): array {
        return ['title' => ['required', 'string', 'max:100'], ...];
    }
}

public function store(BookRequest $request)   // validated before the method runs
{
    Book::create($request->validated());
}
```

An invalid body gets a **422** with `errors`.

### 5. Middleware

```php
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);   // next(), but it returns the response
    return $response;
}
```

Register it in `bootstrap/app.php`: `append()` for global middleware, `alias()` to name it for routes.

### 6. Auth

```php
Route::middleware('api.token')->group(function () {
    Route::post('/books', ...);
});
```

Real Laravel APIs use **Sanctum** (`php artisan install:api`).

### 7. Errors and 404

```php
abort(404, 'Book not found');               // res.status(404)...
Book::findOrFail($id);                      // 404 if missing
Route::fallback(fn () => ...);              // app.use(notFound)
```

Customize the error format in `withExceptions()` in `bootstrap/app.php`.

### 8. Database: Eloquent

```php
Book::all();
Book::where('author', 'like', '%martin%')->get();
Book::create([...]);      // only fields in $fillable are allowed
$book->update([...]);
$book->delete();
```

```bash
php artisan make:migration create_books_table
php artisan migrate
php artisan db:seed
```

### 9. Config

`.env` → `config/*.php` → `config('app.api_token')`. Only call `env()` inside config files. Laravel caches config in production, and then `env()` returns null elsewhere.

### 10. Service container (DI)

Type-hint a class in a controller method or constructor, and Laravel creates and passes it in. That's how `Request`, `BookRequest` and `Book $book` arrive above.

## Generators (saves a lot of typing)

```bash
php artisan make:model Book -mcr          # model + migration + resource controller
php artisan make:request BookRequest
php artisan make:middleware CheckApiToken
php artisan route:list                    # show all routes
php artisan tinker                        # interactive shell with your models
```

## Gotchas

- `MassAssignmentException` means the field is missing from `$fillable`.
- API routes get an `/api` prefix by default. This project removes it with `apiPrefix: ''`.
- CSRF protection applies to `web` routes, not `api` routes.

## Learn next

Sanctum, API Resources (to shape the JSON), Eloquent relationships, queues, and feature tests (`php artisan test`).
