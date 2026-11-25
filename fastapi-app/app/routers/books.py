# Router: like express.Router(). Type hints tell FastAPI where each value comes from.
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, select

from app.database import SessionDep
from app.dependencies import require_token
from app.models import Book, BookCreate

router = APIRouter(prefix="/books", tags=["books"])
protected = [Depends(require_token)]


def get_book_or_404(session: SessionDep, book_id: int) -> Book:
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# GET /books?author=martin   (a parameter not in the path = query parameter)
@router.get("")
def list_books(session: SessionDep, author: str | None = None) -> list[Book]:
    query = select(Book)
    if author:
        query = query.where(col(Book.author).ilike(f"%{author}%"))
    return list(session.exec(query).all())


# GET /books/5   (book_id: int -> "abc" gives a 422 error automatically)
@router.get("/{book_id}")
def get_book(book_id: int, session: SessionDep) -> Book:
    return get_book_or_404(session, book_id)


# POST /books   (a Pydantic/SQLModel parameter = JSON body, validated)
@router.post("", status_code=201, dependencies=protected)
def create_book(data: BookCreate, session: SessionDep) -> Book:
    book = Book.model_validate(data)
    session.add(book)
    session.commit()
    session.refresh(book)  # reload to get the new id
    return book


# PUT /books/5
@router.put("/{book_id}", dependencies=protected)
def update_book(book_id: int, data: BookCreate, session: SessionDep) -> Book:
    book = get_book_or_404(session, book_id)
    book.sqlmodel_update(data.model_dump())
    session.commit()
    session.refresh(book)
    return book


# DELETE /books/5
@router.delete("/{book_id}", status_code=204, dependencies=protected)
def delete_book(book_id: int, session: SessionDep) -> None:
    session.delete(get_book_or_404(session, book_id))
    session.commit()
