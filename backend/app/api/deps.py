from fastapi import Depends, HTTPException, status, Header
from typing import Optional
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.utils.security import decode_access_token
from app.models.user import User

def get_current_user(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
) -> User:
    """
    Returns authenticated user if JWT token present, or automatically returns/creates 
    a default Guest user (id=1) to allow passwordless access to the Chatbot.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and payload.get("sub"):
            user_id = payload.get("sub")
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user and user.is_active:
                return user

    # Default Guest User (Passwordless direct chatbot access)
    guest_user = db.query(User).filter(User.id == 1).first()
    if not guest_user:
        guest_user = User(
            id=1,
            email="guest@pydoc.ai",
            hashed_password="guest_nopassword_hash",
            full_name="Python Guest User",
            is_active=True
        )
        db.add(guest_user)
        db.commit()
        db.refresh(guest_user)

    return guest_user
