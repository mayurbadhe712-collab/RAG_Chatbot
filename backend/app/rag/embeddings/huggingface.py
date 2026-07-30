from typing import List
from app.config.settings import settings

try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    from langchain_community.embeddings import HuggingFaceEmbeddings

class EmbeddingService:
    _instance = None

    @classmethod
    def get_embeddings(cls):
        if cls._instance is None:
            cls._instance = HuggingFaceEmbeddings(
                model_name=settings.EMBEDDING_MODEL_NAME,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
        return cls._instance
