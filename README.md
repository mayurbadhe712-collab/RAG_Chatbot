# Python RAG Chatbot

An enterprise-grade, production-ready AI-powered Retrieval-Augmented Generation (RAG) Chatbot built specifically for Python documentation and codebase queries.

> **CRITICAL RULE**: This assistant answers **ONLY** Python-related questions. Any non-Python query (sports, politics, movies, other languages, general knowledge, math without code) is immediately intercepted and declined with:
> 
> `"I'm a Python Documentation Assistant. I can answer only Python-related questions."`

---

## 🌟 Tech Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons
- **HTTP Client**: Axios with JWT Interceptors
- **Code Highlighting**: `react-syntax-highlighter` + `react-markdown` + `remark-gfm`
- **Routing**: React Router DOM v6

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL (SQLAlchemy 2.0 ORM) with SQLite fallback
- **Vector Database**: Persistent ChromaDB Store
- **RAG Framework**: LangChain
- **Embeddings**: HuggingFace SentenceTransformers (`all-MiniLM-L6-v2`)
- **Document Loader**: PyPDFLoader
- **Text Chunking**: RecursiveCharacterTextSplitter (1000 size, 200 overlap)
- **LLM Engine**: Groq API (`llama-3.3-70b-versatile`)
- **Authentication**: JWT Auth with password hashing (`passlib` & `bcrypt`)

---

## 📁 Folder Structure

```
python/
├── backend/
│   ├── app/
│   │   ├── api/             # Auth, Document, and Chat REST endpoints
│   │   ├── config/          # Pydantic environment configuration
│   │   ├── database/        # DB engine, sessions, init
│   │   ├── models/          # User, Document, Chat SQLAlchemy models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # PDF extraction & ChromaDB vector storage logic
│   │   ├── rag/
│   │   │   ├── classifier.py       # Python Intent Detector Guardrail
│   │   │   ├── loaders/            # PyPDFLoader integration
│   │   │   ├── chunking/           # RecursiveCharacterTextSplitter
│   │   │   ├── embeddings/         # SentenceTransformers embeddings
│   │   │   ├── vectordb/           # Persistent ChromaDB store
│   │   │   └── llm/                # Groq API client with system prompt
│   │   └── utils/           # JWT & password security helpers
│   ├── main.py              # FastAPI application entry point
│   ├── requirements.txt     # Python backend dependencies
│   ├── .env.example         # Sample environment configurations
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Common, Chat, & Document UI components
│   │   ├── context/         # Auth & Theme context providers
│   │   ├── layouts/         # Glassmorphic Main & Auth layouts
│   │   ├── pages/           # Login, Register, Dashboard, Chat, Upload, History, Profile, Settings, 404
│   │   ├── services/        # Axios API clients
│   │   ├── styles/          # Tailwind setup & glassmorphism utilities
│   │   ├── App.jsx          # Protected routing configuration
│   │   └── main.jsx
│   ├── package.json         # Node dependencies
│   ├── vite.config.js
│   └── README.md
│
└── README.md
```

---

## 🚀 Step-by-Step Installation & Running Guide

### 1. Backend Setup

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file (refer to `.env.example`):
   ```env
   PROJECT_NAME="Python RAG Chatbot"
   API_V1_STR="/api"
   DATABASE_URL=sqlite:///./python_rag.db
   GROQ_API_KEY=gsk_your_groq_api_key_here
   JWT_SECRET_KEY=super_secret_python_rag_jwt_key_32bytes_minimum_length_2026
   ```

5. Launch the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   API Docs available at: `http://localhost:8000/api/docs`

---

### 2. Frontend Setup

1. Open a terminal in `frontend/`:
   ```bash
   cd frontend
   ```

2. Install Node packages:
   ```bash
   npm install
   ```

3. Start Vite dev server:
   ```bash
   npm run dev
   ```

4. Open browser at `http://localhost:5173`.

---

## 🛡️ Python Guardrail Enforcement Matrix

| Query Category | Input Example | Response Outcome |
| :--- | :--- | :--- |
| **Python Syntax** | *"How to use list comprehensions with if-else?"* | ✅ **RAG Generation** |
| **Python Ecosystem** | *"Explain FastAPI dependency injection"* | ✅ **RAG Generation** |
| **Python Class** | *"What is the GIL and how does asyncio bypass it?"* | ✅ **RAG Generation** |
| **Sports** | *"Who won the FIFA World Cup?"* | ❌ `"I'm a Python Documentation Assistant..."` |
| **Politics** | *"Who is the President of France?"* | ❌ `"I'm a Python Documentation Assistant..."` |
| **Movies** | *"What is the plot of Inception?"* | ❌ `"I'm a Python Documentation Assistant..."` |
| **Other Language** | *"How to create a HashMap in Java?"* | ❌ `"I'm a Python Documentation Assistant..."` |
| **Pure Math** | *"What is 45 * 12?"* | ❌ `"I'm a Python Documentation Assistant..."` |

---

## 🔒 Security Features
- **JWT Protection**: Secured bearer tokens for all protected routes (`/chat`, `/documents`, `/history`, `/profile`).
- **Input Validation**: Strict file type restrictions (`.pdf` only) and maximum payload limits (25MB).
- **CORS Protection**: Scoped origins configuration.
- **SQL Injection Prevention**: Built entirely with SQLAlchemy ORM parameter binding.
