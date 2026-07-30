from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import re

app = FastAPI(title="Python RAG Serverless Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
REFUSAL_MESSAGE = "I'm a Python Documentation Assistant. I can answer only Python-related questions."

PYTHON_KEYWORDS = {
    "python", "py", "pip", "conda", "venv", "def", "class", "import", "from", "lambda", "yield", "async", "await",
    "self", "dunder", "__init__", "__main__", "list comprehension", "dict comprehension", "generator", "decorator", "gil",
    "pandas", "numpy", "scipy", "matplotlib", "seaborn", "scikit-learn", "tensorflow", "pytorch", "torch", "fastapi",
    "flask", "django", "sqlalchemy", "pydantic", "celery", "pytest", "requests", "httpx", "asyncio", "multiprocessing"
}

FORBIDDEN_PATTERNS = [
    r'\b(java|c\+\+|cpp|c#|csharp|php|ruby|swift|kotlin|rust|golang|go lang)\b',
    r'\b(president|election|politics|government|democrat|republican|minister|war)\b',
    r'\b(cricket|football|soccer|basketball|baseball|nba|messi|ronaldo|movie|actor|cinema)\b',
    r'\b(medicine|doctor|symptom|disease|treatment|diagnosis|legal advice|lawyer)\b',
    r'\b(capital of|who is the king|population of|recipe for|cook|cake|pizza|weather in)\b'
]

def is_python_related(query: str) -> bool:
    clean_query = query.strip()
    lowered = clean_query.lower()
    if not clean_query:
        return False
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, lowered):
            if "in python" in lowered or "to python" in lowered or "vs python" in lowered:
                continue
            return False
    for kw in PYTHON_KEYWORDS:
        if " " in kw or "_" in kw:
            if kw in lowered:
                return True
        else:
            if re.search(rf'\b{re.escape(kw)}\b', lowered):
                return True
    code_patterns = [r'def\s+\w+\s*\(', r'class\s+\w+', r'import\s+\w+', r'from\s+\w+\s+import', r'print\s*\(']
    for pattern in code_patterns:
        if re.search(pattern, lowered):
            return True
    generic_prog_terms = ["function", "variable", "loop", "array", "list", "dictionary", "class", "object", "algorithm"]
    for term in generic_prog_terms:
        if term in lowered:
            return True
    return False

class ChatRequest(BaseModel):
    message: str

SYSTEM_PROMPT = """You are an expert Python Documentation Assistant.
Answer ONLY Python-related questions.
Use your expert Python knowledge to provide a comprehensive, clear answer with code examples.
NEVER answer questions unrelated to Python (sports, politics, movies, general trivia, non-Python code).
"""

@app.get("/api/")
@app.get("/api")
def root():
    return {"status": "online", "mode": "Vercel Serverless RAG"}

@app.post("/api/chat/")
@app.post("/api/chat")
def ask_question(chat_in: ChatRequest):
    query = chat_in.message.strip()
    if not is_python_related(query):
        return {
            "id": 1,
            "prompt": query,
            "response": REFUSAL_MESSAGE,
            "is_python_query": False,
            "sources": [],
            "created_at": "2026-07-30T12:00:00"
        }

    try:
        from langchain_groq import ChatGroq
        from langchain_core.messages import SystemMessage, HumanMessage
        llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.3-70b-versatile", temperature=0.2)
        messages = [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=f"User Question:\n{query}")]
        res = llm.invoke(messages)
        answer = res.content.strip()
    except Exception as e:
        answer = f"Python is a versatile programming language. (Serverless response: {str(e)})"

    return {
        "id": 1,
        "prompt": query,
        "response": answer,
        "is_python_query": True,
        "sources": [],
        "created_at": "2026-07-30T12:00:00"
    }

@app.get("/api/chat/history")
def get_chat_history():
    return []

@app.get("/api/documents/")
@app.get("/api/documents")
def get_documents():
    return []

@app.get("/api/auth/profile")
def get_profile():
    return {"id": 1, "email": "guest@pydoc.ai", "full_name": "Python Guest", "is_active": True, "created_at": "2026-07-30T12:00:00"}
