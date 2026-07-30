import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document as LCDocument

class CustomPDFLoader:
    def __init__(self, file_path: str):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF file not found at path: {file_path}")
        self.file_path = file_path

    def load(self) -> List[LCDocument]:
        """
        Loads PDF document and returns a list of LangChain Document objects with page metadata.
        """
        loader = PyPDFLoader(self.file_path)
        docs = loader.load()
        return docs
