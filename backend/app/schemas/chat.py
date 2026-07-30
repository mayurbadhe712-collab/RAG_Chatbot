from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Any

class ChatRequest(BaseModel):
    message: str

class SourceMetadata(BaseModel):
    document_id: Optional[int] = None
    filename: Optional[str] = None
    page: Optional[int] = None
    chunk_index: Optional[int] = None
    text_snippet: Optional[str] = None

class ChatResponse(BaseModel):
    id: int
    prompt: str
    response: str
    is_python_query: bool
    sources: List[SourceMetadata] = []
    created_at: datetime

    class Config:
        from_attributes = True
