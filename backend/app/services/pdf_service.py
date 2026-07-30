import os
import shutil
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.models.document import Document
from app.rag.loaders.pdf_loader import CustomPDFLoader
from app.rag.chunking.splitter import CustomTextSplitter
from app.rag.vectordb.chromadb import VectorDBService
from app.config.settings import settings

class PDFService:
    @staticmethod
    def process_and_store_pdf(file: UploadFile, user_id: int, db: Session) -> Document:
        # Validate File Type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")

        # Save File to Upload Directory
        user_upload_dir = os.path.join(settings.UPLOAD_DIR, f"user_{user_id}")
        os.makedirs(user_upload_dir, exist_ok=True)
        
        file_path = os.path.join(user_upload_dir, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = os.path.getsize(file_path)
        if file_size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            os.remove(file_path)
            raise HTTPException(status_code=400, detail=f"File exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB")

        # 1. Extract Text using PyPDFLoader
        try:
            loader = CustomPDFLoader(file_path)
            raw_docs = loader.load()
            if not raw_docs:
                raise HTTPException(status_code=400, detail="The uploaded PDF file is empty or contains no readable text.")
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=400, detail=f"Failed to process PDF: {str(e)}")

        # Enrich document metadata with filename
        for doc in raw_docs:
            doc.metadata["filename"] = file.filename

        # 2. Chunk Text using RecursiveCharacterTextSplitter
        splitter = CustomTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(raw_docs)

        # 3. Create Document Record in DB
        db_doc = Document(
            filename=file.filename,
            file_path=file_path,
            file_size=file_size,
            chunk_count=len(chunks),
            user_id=user_id
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)

        # 4. Generate Embeddings & Store in ChromaDB
        vdb = VectorDBService()
        vdb.add_documents(documents=chunks, user_id=user_id, document_id=db_doc.id)

        return db_doc

    @staticmethod
    def delete_pdf(document_id: int, user_id: int, db: Session) -> bool:
        doc = db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
        if not doc:
            return False

        # Delete physical file
        if os.path.exists(doc.file_path):
            try:
                os.remove(doc.file_path)
            except Exception as e:
                print(f"Failed to delete file {doc.file_path}: {e}")

        # Delete ChromaDB chunks
        vdb = VectorDBService()
        vdb.delete_document_chunks(document_id=document_id, user_id=user_id)

        # Delete DB metadata
        db.delete(doc)
        db.commit()
        return True
