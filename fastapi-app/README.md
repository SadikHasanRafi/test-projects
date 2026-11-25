# FastAPI for Express developers

Python's closest match to Express: small, function-based routes. Its superpower is **type hints**: they drive validation, conversion and the auto-generated docs.

## Run

Needs [uv](https://docs.astral.sh/uv/) (a Python package manager, like pnpm).

```bash
cd fastapi-app
uv sync                                       # like pnpm install
uv run fastapi dev app/main.py --port 4003    # http://localhost:4003
```

Open **http://localhost:4003/docs** to get interactive API docs for free.

## Folder structure

```
app/                     Express equivalent
├── main.py              app.js + server.js
├── config.py            config.js
├── database.py          db.js
├── models.py            models/ + validators/ (one class does both)
├── dependencies.py      middleware/auth.js
└── routers/books.py     routes/ + controllers/
```

## Side by side

### 1. Create and start

```python
app = FastAPI()          # app = express()
```

Uvicorn is the server, started by `fastapi dev`.

### 2. Routes are decorated functions

```python
# Express: router.get('/:id', getBook)
@router.get("/{book_id}")
def get_book(book_id: int, session: SessionDep) -> Book:
    return book                      # returned value → JSON

@router.post("", status_code=201)    # res.status(201)
```

`app.include_router(books.router)` is like `app.use('/books', booksRouter)`.

### 3. URL params and query come from function arguments

```python
def list_books(author: str | None = None)   # not in the path → query: ?author=
def get_book(book_id: int)                  # in the path → URL param, converted to int
```

### 4. Body validation: built in (Pydantic)

```python
class BookCreate(SQLModel):
    title: str = Field(min_length=1, max_length=100)

def create_book(data: BookCreate)   # a class argument = JSON body, validated
```

An invalid body gets a **422** (not 400) with the details.

### 5. Middleware

```python
@app.middleware("http")
async def log_requests(request, call_next):
    response = await call_next(request)     # next()
    return response
```

### 6. Auth → dependencies

FastAPI prefers **dependencies** over middleware for per-route logic:

```python
def require_token(authorization: Annotated[str | None, Header()] = None):
    if authorization != f"Bearer {settings.api_token}":
        raise HTTPException(401, "Unauthorized")

@router.post("", dependencies=[Depends(require_token)])
```

### 7. Errors and 404

```python
raise HTTPException(status_code=404, detail="Book not found")   # → {"detail": "Book not found"}

@app.exception_handler(Exception)   # like (err, req, res, next)
```

Unknown routes get a 404 automatically.

### 8. Database: SQLModel

SQLModel is SQLAlchemy (the ORM) plus Pydantic (validation).

```python
session.get(Book, 5)                                     # find by id
session.exec(select(Book).where(...)).all()              # query
session.add(book); session.commit()                      # insert / update
```

Real projects use **Alembic** for migrations.

### 9. Config

`pydantic-settings` reads `.env` into a typed `Settings` class. See [config.py](app/config.py).

### 10. Dependency injection: `Depends()`

Any function can be a dependency: a database session, the current user, pagination. FastAPI calls it and passes in the result.

```python
SessionDep = Annotated[Session, Depends(get_session)]
def list_books(session: SessionDep): ...
```

## `def` or `async def`?

These routes use plain `def`, because the database session is not async. FastAPI runs them in a thread pool. Use `async def` only when you `await` something, such as `httpx` or an async database driver.

## Gotchas

- Validation errors are **422**, not 400.
- A model with `table=True` does **not** validate. Validate with a separate model (`BookCreate`), then convert it.
- With a router prefix, `@router.get("/")` means `/books/`. Use `""` to get `/books`.

## Learn next

Alembic, async SQLAlchemy, OAuth2 + JWT (built-in helpers), `BackgroundTasks`, and testing with `TestClient` + pytest.
