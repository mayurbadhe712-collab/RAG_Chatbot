# Python RAG Chatbot - Backend

Production-ready FastAPI backend for the Python Documentation RAG Assistant.

## Features
- **Strict Python Intent Guardrail**: Multi-stage pattern matcher to filter non-Python queries before vector DB or LLM execution.
- **PyPDF Text Extraction**: Uses `PyPDFLoader` to parse uploaded Python documentation.
- **Chunking & Vector Store**: `RecursiveCharacterTextSplitter` (1000 size, 200 overlap) and persistent `ChromaDB`.
- **Groq LLM Integration**: Generates context-grounded answers via Llama 3 70B.
- **JWT Auth & Security**: User authentication, password hashing, and route protection.

## Setup Instructions

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure environment variables in `.env`:
   ```env
   DATABASE_URL=sqlite:///./python_rag.db
   GROQ_API_KEY=gsk_your_groq_api_key
   JWT_SECRET_KEY=super_secret_python_rag_jwt_key
   ```

3. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. API Documentation will be available at:
   - `http://localhost:8000/api/docs`
