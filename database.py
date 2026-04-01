from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool

from config import settings

# Use NullPool to avoid immediate connection attempts
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    poolclass=NullPool,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db() -> None:
    from models import User

    Base.metadata.create_all(bind=engine, tables=[User.__table__])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
