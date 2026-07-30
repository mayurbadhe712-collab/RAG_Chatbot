from typing import List
from app.config.settings import settings
from langchain_core.documents import Document as LCDocument

SYSTEM_PROMPT = """You are an expert Python Documentation Assistant.
Answer ONLY Python-related questions.

Guidelines:
1. If retrieved PDF documentation context is provided, prioritize using it to answer the query.
2. If the query is a valid Python question (e.g., Python definitions, syntax, libraries, algorithms, best practices), use your expert Python knowledge to provide a comprehensive, clear answer with code examples.
3. NEVER answer questions unrelated to Python (such as sports, politics, movies, general trivia, non-Python code).
"""

class GroqLLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model_name = settings.GROQ_MODEL
        self.llm = None
        
        if self.api_key and self.api_key != "gsk_demo_key":
            try:
                from langchain_groq import ChatGroq
                self.llm = ChatGroq(
                    groq_api_key=self.api_key,
                    model_name=self.model_name,
                    temperature=0.2
                )
            except Exception as e:
                print(f"Warning: ChatGroq initialization failed: {e}")

    def generate_response(self, query: str, context_docs: List[LCDocument]) -> str:
        """
        Generates a Python answer grounded in retrieved context + expert Python knowledge.
        """
        # Format context strings if available
        context_str = ""
        if context_docs:
            context_str = "\n\n---\n\n".join([
                f"[Source: {doc.metadata.get('filename', 'PDF')} - Page {doc.metadata.get('page', 0) + 1}]\n{doc.page_content}"
                for doc in context_docs
            ])

        if context_str:
            user_message = f"""Retrieved PDF Context:
{context_str}

User Question:
{query}
"""
        else:
            user_message = f"User Question:\n{query}"

        # If LLM client is available, call Groq API
        if self.llm:
            try:
                from langchain_core.messages import SystemMessage, HumanMessage
                messages = [
                    SystemMessage(content=SYSTEM_PROMPT),
                    HumanMessage(content=user_message)
                ]
                res = self.llm.invoke(messages)
                return res.content.strip()
            except Exception as e:
                print(f"Groq API Call error: {e}")

        # Fallback response generator if API Key issue
        if context_docs:
            return f"Based on retrieved Python documentation:\n\n{context_docs[0].page_content}"
        
        return "Python is a high-level, interpreted programming language known for its easy syntax, dynamic typing, and vast ecosystem for web development, data science, and AI."
