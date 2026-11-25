# Entry point: create the app, add middleware, include routers.
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.database import init_db
from app.routers import books


# Lifespan: code before `yield` runs at startup, after it at shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Books API", lifespan=lifespan)


# Global middleware: like app.use() in Express. call_next = next()
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    ms = round((time.perf_counter() - start) * 1000)
    print(f"{request.method} {request.url.path} {response.status_code} {ms}ms")
    return response


# Global error handler for unexpected errors (HTTPException is handled by FastAPI)
@app.exception_handler(Exception)
async def unhandled_error(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/")
def hello():
    return {"message": "Hello from FastAPI"}  # dicts are sent as JSON


app.include_router(books.router)  # like app.use('/books', booksRouter)
