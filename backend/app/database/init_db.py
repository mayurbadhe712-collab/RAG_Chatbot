from app.database.session import Base, engine
from app.models.user import User
from app.models.document import Document
from app.models.chat import ChatMessage

def init_db():
    Base.metadata.create_all(bind=engine)
