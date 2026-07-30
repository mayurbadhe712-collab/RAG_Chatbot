from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.chat import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse, SourceMetadata
from app.rag.classifier import is_python_related, REFUSAL_MESSAGE
from app.rag.vectordb.chromadb import VectorDBService
from app.rag.llm.groq_client import GroqLLMService

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
def ask_question(
    chat_in: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = chat_in.message.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")

    # 1. Strict Python Guardrail Check
    is_valid_python, refusal_or_query = is_python_related(query)
    
    if not is_valid_python:
        # Save refusal in history for user context tracking
        chat_record = ChatMessage(
            user_id=current_user.id,
            prompt=query,
            response=REFUSAL_MESSAGE,
            sources=[],
            is_python_query=False
        )
        db.add(chat_record)
        db.commit()
        db.refresh(chat_record)
        
        return ChatResponse(
            id=chat_record.id,
            prompt=chat_record.prompt,
            response=chat_record.response,
            is_python_query=False,
            sources=[],
            created_at=chat_record.created_at
        )

    # 2. Python-related query confirmed: Vector DB similarity search
    vdb = VectorDBService()
    context_docs = vdb.similarity_search(query=query, user_id=current_user.id, k=4)

    # 3. LLM RAG Answer Generation
    llm_service = GroqLLMService()
    answer = llm_service.generate_response(query=query, context_docs=context_docs)

    # 4. Extract Source Metadata
    sources_data = []
    for doc in context_docs:
        meta = doc.metadata
        sources_data.append({
            "document_id": meta.get("document_id"),
            "filename": meta.get("filename", "Uploaded PDF"),
            "page": (meta.get("page", 0) + 1) if meta.get("page") is not None else 1,
            "chunk_index": meta.get("chunk_index", 0),
            "text_snippet": doc.page_content[:150] + "..." if len(doc.page_content) > 150 else doc.page_content
        })

    # 5. Persist Chat History
    chat_record = ChatMessage(
        user_id=current_user.id,
        prompt=query,
        response=answer,
        sources=sources_data,
        is_python_query=True
    )
    db.add(chat_record)
    db.commit()
    db.refresh(chat_record)

    return ChatResponse(
        id=chat_record.id,
        prompt=chat_record.prompt,
        response=chat_record.response,
        is_python_query=True,
        sources=[SourceMetadata(**s) for s in sources_data],
        created_at=chat_record.created_at
    )

@router.get("/history", response_model=List[ChatResponse])
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    response_list = []
    for msg in history:
        srcs = [SourceMetadata(**s) for s in (msg.sources or [])]
        response_list.append(ChatResponse(
            id=msg.id,
            prompt=msg.prompt,
            response=msg.response,
            is_python_query=msg.is_python_query,
            sources=srcs,
            created_at=msg.created_at
        ))
    return response_list

@router.delete("/history", status_code=status.HTTP_200_OK)
def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Chat history cleared successfully."}
