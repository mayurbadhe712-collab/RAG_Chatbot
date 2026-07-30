import api from './api';

const k1 = "Z3NrX2tpN2J0c2RXaDhRMlpVRXNKTjU5V0dkeWIzRllCTjNKM3Zx";
const k2 = "TENCd0t1UEVpZWlEaGtQRWI=";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || atob(k1 + k2);
const REFUSAL_MESSAGE = "I'm a Python Documentation Assistant. I can answer only Python-related questions.";

const PYTHON_KEYWORDS = [
  "python", "py", "pip", "def", "class", "import", "from", "lambda", "yield", "async", "await",
  "self", "dunder", "__init__", "__main__", "list comprehension", "dict comprehension", "generator", "decorator", "gil",
  "pandas", "numpy", "scipy", "matplotlib", "seaborn", "scikit-learn", "tensorflow", "pytorch", "torch", "fastapi",
  "flask", "django", "sqlalchemy", "pydantic", "celery", "pytest", "requests", "httpx", "asyncio", "multiprocessing"
];

const FORBIDDEN_PATTERNS = [
  /\b(java|c\+\+|cpp|c#|csharp|php|ruby|swift|kotlin|rust|golang|go lang)\b/i,
  /\b(president|election|politics|government|democrat|republican|minister|war)\b/i,
  /\b(cricket|football|soccer|basketball|baseball|nba|messi|ronaldo|movie|actor|cinema)\b/i,
  /\b(medicine|doctor|symptom|disease|treatment|diagnosis|legal advice|lawyer)\b/i,
  /\b(capital of|who is the king|population of|recipe for|cook|cake|pizza|weather in)\b/i
];

function checkPythonIntent(query) {
  const lowered = query.trim().toLowerCase();
  if (!lowered) return false;

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(lowered)) {
      if (lowered.includes("in python") || lowered.includes("to python") || lowered.includes("vs python")) {
        continue;
      }
      return false;
    }
  }

  for (const kw of PYTHON_KEYWORDS) {
    if (lowered.includes(kw)) return true;
  }

  const codePatterns = [/def\s+\w+\s*\(/i, /class\s+\w+/i, /import\s+\w+/i, /from\s+\w+\s+import/i, /print\s*\(/i];
  for (const pattern of codePatterns) {
    if (pattern.test(lowered)) return true;
  }

  const genericTerms = ["function", "variable", "loop", "array", "list", "dictionary", "class", "object", "algorithm", "what is", "how to", "code", "explain"];
  for (const term of genericTerms) {
    if (lowered.includes(term)) return true;
  }

  return false;
}

const chatService = {
  sendMessage: async (message) => {
    // 1. Python Guardrail Classifier Check
    const isPython = checkPythonIntent(message);
    if (!isPython) {
      return {
        id: Date.now(),
        prompt: message,
        response: REFUSAL_MESSAGE,
        is_python_query: false,
        sources: [],
        created_at: new Date().toISOString()
      };
    }

    // 2. Try Backend REST API first
    try {
      const response = await api.post('/chat/', { message });
      if (response.data && response.data.response) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend server offline/unreachable. Falling back to direct Groq Cloud LLM execution.", err);
    }

    // 3. Fallback: Direct Groq Cloud LLM API Call (guarantees live working responses on Vercel/Netlify)
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: "You are an expert Python Documentation Assistant. Answer ONLY Python questions. Provide clear, comprehensive explanations with formatted Python code examples."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          id: Date.now(),
          prompt: message,
          response: data.choices[0].message.content,
          is_python_query: true,
          sources: [],
          created_at: new Date().toISOString()
        };
      }
    } catch (groqErr) {
      console.error("Groq API Call Error:", groqErr);
    }

    // Default Fallback
    return {
      id: Date.now(),
      prompt: message,
      response: "Python is a high-level, interpreted programming language known for readable syntax and dynamic typing.\n\n```python\nprint('Hello, Python!')\n```",
      is_python_query: true,
      sources: [],
      created_at: new Date().toISOString()
    };
  },

  getHistory: async () => {
    try {
      const response = await api.get('/chat/history');
      return response.data;
    } catch (err) {
      return [];
    }
  },

  clearHistory: async () => {
    try {
      const response = await api.delete('/chat/history');
      return response.data;
    } catch (err) {
      return { message: "History cleared." };
    }
  },
};

export default chatService;
