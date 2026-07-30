import os
from typing import List, Dict, Any, Optional
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document as LCDocument
from app.config.settings import settings
from app.rag.embeddings.huggingface import EmbeddingService

COLLECTION_NAME = "python_docs"

class VectorDBService:
    def __init__(self):
        self.embeddings = EmbeddingService.get_embeddings()
        self.persist_directory = settings.CHROMA_DB_DIR
        os.makedirs(self.persist_directory, exist_ok=True)
        
        self.vector_store = Chroma(
            collection_name=COLLECTION_NAME,
            embedding_function=self.embeddings,
            persist_directory=self.persist_directory
        )

    def add_documents(self, documents: List[LCDocument], user_id: int, document_id: int) -> int:
        """
        Adds text chunks to ChromaDB with user_id and document_id metadata.
        """
        if not documents:
            return 0
        
        # Enrich metadata for each chunk
        for idx, doc in enumerate(documents):
            doc.metadata["user_id"] = user_id
            doc.metadata["document_id"] = document_id
            doc.metadata["chunk_index"] = idx

        self.vector_store.add_documents(documents)
        return len(documents)

    def similarity_search(
        self, query: str, user_id: Optional[int] = None, k: int = 4
    ) -> List[LCDocument]:
        """
        Performs similarity search in ChromaDB.
        """
        filter_dict = {}
        if user_id is not None:
            filter_dict = {"user_id": user_id}

        results = self.vector_store.similarity_search(
            query=query,
            k=k,
            filter=filter_dict if filter_dict else None
        )
        return results

    def delete_document_chunks(self, document_id: int, user_id: int):
        """
        Deletes all chunks belonging to a document.
        """
        try:
            # Chroma DB deletion by metadata filter
            collection = self.vector_store._collection
            collection.delete(where={"$and": [{"document_id": document_id}, {"user_id": user_id}]})
        except Exception as e:
            print(f"Error deleting chunks from ChromaDB: {e}")
