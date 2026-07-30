from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentResponse, DocumentUploadResponse
from app.services.pdf_service import PDFService

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload-pdf", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = PDFService.process_and_store_pdf(file=file, user_id=current_user.id, db=db)
    return DocumentUploadResponse(
        message="PDF processed and vectors indexed successfully.",
        document=document
    )

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Document).filter(Document.user_id == current_user.id).all()

@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = PDFService.delete_pdf(document_id=document_id, user_id=current_user.id, db=db)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or unauthorized.")
    return {"message": "Document and associated vectors deleted successfully."}
