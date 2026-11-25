# SQLModel = SQLAlchemy (database) + Pydantic (validation) in one class.
from sqlmodel import Field, SQLModel


# Shared fields and their validation rules
class BookBase(SQLModel):
    title: str = Field(min_length=1, max_length=100)
    author: str = Field(min_length=1, max_length=100)
    year: int | None = Field(default=None, ge=0, le=2100)


# table=True -> a database table (the "model")
class Book(BookBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


# Request body schema (like a zod schema or a DTO). No id: the client doesn't send it
class BookCreate(BookBase):
    pass
