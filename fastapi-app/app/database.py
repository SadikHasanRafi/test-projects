from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine, select

from app.config import settings
from app.models import Book

engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})


def init_db():
    SQLModel.metadata.create_all(engine)  # create tables (real projects use Alembic migrations)
    with Session(engine) as session:
        if session.exec(select(Book)).first() is None:  # seed
            session.add(Book(title="Clean Code", author="Robert C. Martin", year=2008))
            session.add(Book(title="The Pragmatic Programmer", author="Andy Hunt", year=1999))
            session.commit()


# Dependency: gives each request its own DB session, closed afterwards
def get_session():
    with Session(engine) as session:
        yield session


# Shortcut type: `session: SessionDep` in a route = "inject a session here"
SessionDep = Annotated[Session, Depends(get_session)]
