# Django (+ Django REST Framework) for Express developers

Django is "batteries included": ORM, migrations, admin panel and auth all come built in. For JSON APIs, everyone adds **Django REST Framework (DRF)**.

## Run

Needs [uv](https://docs.astral.sh/uv/).

```bash
cd django-app
uv sync
uv run python manage.py migrate            # create tables + sample data
uv run python manage.py runserver 4004     # http://localhost:4004
```

## Folder structure

A Django **project** holds settings. **Apps** are feature folders.

```
manage.py                 CLI: runserver, migrate, makemigrations, shell
config/                   the project                    Express equivalent
├── settings.py           all settings                   config.js + app.js setup
├── urls.py               root URL list                  app.use(...) lines in app.js
├── views.py              hello + 404 views
├── middleware.py         request logger                 middleware/logger.js
├── authentication.py     token check                    middleware/auth.js
└── wsgi.py               for production servers
books/                    the books app
├── models.py             Book table                     models/ + db.js
├── serializers.py        validation + JSON              validators/
├── views.py              request handlers               controllers/
├── urls.py               book URLs                      routes/
└── migrations/           database versions              (none in Express)
```

## Side by side

### 1. Create and start

There's no `app = ...` line. `manage.py runserver` loads `config/settings.py`, and that file wires everything together.

### 2. Routes: a list of patterns

```python
# Express: router.get('/:id', getBook)
path("books/<int:pk>", views.book_detail)

# Express: app.use('/', booksRouter)
path("", include("books.urls"))
```

One view handles every method for a URL:

```python
@api_view(["GET", "PUT", "DELETE"])
def book_detail(request, pk):
    if request.method == "GET": ...
```

### 3. URL params and query

```python
def book_detail(request, pk)               # <int:pk> → pk, as an int
request.query_params.get("author")         # req.query.author
```

### 4. Body validation: serializers

```python
serializer = BookSerializer(data=request.data)   # request.data = req.body
serializer.is_valid(raise_exception=True)        # 400 with errors
serializer.save()                                # insert into the DB
```

A `ModelSerializer` reads the rules (`max_length`, `null`) straight from the model.

### 5. Middleware

```python
def request_logger(get_response):
    def middleware(request):
        response = get_response(request)   # next()
        return response
    return middleware
```

Register it in `MIDDLEWARE` in [settings.py](config/settings.py). The list order is the run order.

### 6. Auth: two parts in DRF

- **Authentication**: *who* is calling. Here that's [authentication.py](config/authentication.py).
- **Permission**: are they *allowed*. Here that's `IsAuthenticatedOrReadOnly`: anyone can GET, only token holders can write.

Both are set once in `REST_FRAMEWORK` in settings, instead of on each route.

### 7. Errors and 404

```python
raise NotFound("Book not found")      # → 404 {"detail": "Book not found"}
```

`is_valid(raise_exception=True)` raises a 400 for you. A catch-all `re_path(r"^.*$", ...)` at the end of `urls.py` handles unknown routes.

### 8. Database: the Django ORM (built in)

```python
Book.objects.all()
Book.objects.filter(author__icontains="martin")     # WHERE author LIKE '%martin%'
Book.objects.get(pk=5)                              # raises Book.DoesNotExist
book.delete()
```

Migrations:

```bash
uv run python manage.py makemigrations   # after changing models.py: writes a migration file
uv run python manage.py migrate          # applies migrations to the database
```

Sample data is added by a **data migration**: [0002_seed_books.py](books/migrations/0002_seed_books.py).

### 9. Config

Everything lives in `settings.py`. Secrets come from `os.getenv()`. To load a `.env` file, use `uv run --env-file .env python manage.py runserver 4004`.

### 10. Structure and dependency injection

There's no DI container. Django uses imports and **settings strings** (`"config.middleware.request_logger"`). The structure is fixed: a project plus apps.

## Shortcut: ViewSets

Function views are shown here because they're closest to Express. Most real DRF code replaces both views with:

```python
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
# plus a router in urls.py that creates all 5 routes
```

## Gotchas

- Changed `models.py`? Run `makemigrations` and then `migrate`.
- A new app must be added to `INSTALLED_APPS`.
- Django usually uses trailing slashes (`/books/`). This project doesn't, so it matches Express.
- `ALLOWED_HOSTS` must include your domain in production.

## Learn next

The admin panel (`django.contrib.admin`), ViewSets + routers, `django-filter`, `djangorestframework-simplejwt`, and testing with `APITestCase` or pytest-django.
