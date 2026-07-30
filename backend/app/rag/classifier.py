import re
from typing import Tuple

REFUSAL_MESSAGE = "I'm a Python Documentation Assistant. I can answer only Python-related questions."

# Python core keywords, built-ins, standard libraries, and popular ecosystem frameworks
PYTHON_KEYWORDS = {
    "python", "py", "pip", "conda", "venv", "virtualenv", "poetry",
    "def", "class", "import", "from", "lambda", "yield", "async", "await",
    "self", "dunder", "__init__", "__main__", "__repr__", "__str__", "__call__",
    "list comprehension", "dict comprehension", "set comprehension", "generator",
    "decorator", "gil", "global interpreter lock", "pep8", "pep 8", "pep",
    "type hinting", "type hints", "docstring", "args", "kwargs", "*args", "**kwargs",
    "init", "str", "int", "float", "bool", "list", "dict", "tuple", "set", "frozenset",
    "try", "except", "finally", "raise", "with", "as", "assert",
    "pandas", "numpy", "scipy", "matplotlib", "seaborn", "scikit-learn", "sklearn",
    "tensorflow", "pytorch", "torch", "keras", "fastapi", "flask", "django",
    "sqlalchemy", "pydantic", "celery", "pytest", "unittest", "requests", "httpx",
    "aiohttp", "beautifulsoup", "bs4", "selenium", "playwright", "scrapy",
    "tkinter", "pyqt", "pyside", "pygame", "streamlit", "gradio", "dash",
    "boto3", "asyncio", "multiprocessing", "threading", "subprocess", "pathlib",
    "sys", "os", "json", "math", "random", "datetime", "re", "collections",
    "itertools", "functools", "typing", "dataclasses", "enum", "logging",
    "inspect", "pickle", "sqlite3", "urllib", "hashlib", "argparse"
}

# Strict Non-Python forbidden triggers (Unless explicitly asking to compare with or translate to Python)
FORBIDDEN_PATTERNS = [
    # Non-Python Languages
    r'\b(java|c\+\+|cpp|c#|csharp|php|ruby|swift|kotlin|rust|golang|go lang|dart|typescript|perl|r language|scala|elixir|haskell)\b',
    # Politics & World
    r'\b(president|election|politics|government|democrat|republican|minister|parliament|senate|prime minister|war|treaty)\b',
    # Sports & Entertainment
    r'\b(cricket|football|soccer|basketball|baseball|nba|nfl|messi|ronaldo|ipl|world cup|olympics|movie|actor|actress|cinema|hollywood|bollywood|netflix|song|album|singer)\b',
    # Medical & Legal
    r'\b(medicine|doctor|symptom|disease|treatment|diagnosis|prescription|legal advice|lawyer|court|lawsuit|attorney)\b',
    # General Knowledge / Non-code Trivia
    r'\b(capital of|who is the king|who invented|population of|distance between|recipe for|cook|cake|pizza|weather in)\b'
]

def is_python_related(query: str) -> Tuple[bool, str]:
    """
    Evaluates whether a user query is strictly related to Python programming.
    Returns (True, query) if valid, or (False, REFUSAL_MESSAGE) if invalid.
    """
    clean_query = query.strip()
    lowered = clean_query.lower()

    if not clean_query:
        return False, REFUSAL_MESSAGE

    # 1. Check if user explicitly mentions non-Python topics
    # Note: allow if user says "compare Python with Java" or "translate Java to Python"
    has_python_explicit = "python" in lowered or "py" in lowered
    
    for pattern in FORBIDDEN_PATTERNS:
        match = re.search(pattern, lowered)
        if match:
            # Exception: if query explicitly mentions Python context like "convert Java code to Python"
            if has_python_explicit and ("in python" in lowered or "to python" in lowered or "vs python" in lowered or "compared to python" in lowered):
                continue
            return False, REFUSAL_MESSAGE

    # 2. Check for explicit Python keywords or syntax tokens
    for kw in PYTHON_KEYWORDS:
        # Check whole word boundary for single words, or simple string search for multi-word phrases
        if " " in kw or "*" in kw or "_" in kw:
            if kw in lowered:
                return True, clean_query
        else:
            if re.search(rf'\b{re.escape(kw)}\b', lowered):
                return True, clean_query

    # 3. Check code snippet patterns (e.g. `def foo():`, `import os`, `print(...)`, `[x for x in ...]`)
    code_patterns = [
        r'def\s+\w+\s*\(',
        r'class\s+\w+(\s*\(.*\))?:',
        r'import\s+\w+',
        r'from\s+\w+\s+import',
        r'print\s*\(',
        r'if\s+__name__\s*==\s*[\'"]__main__[\'"]',
        r'\[\s*\w+\s+for\s+\w+\s+in\s+.*\]',
        r'lambda\s+.*:',
        r'raise\s+\w+Error',
        r'try\s*:\s*',
        r'except\s+.*:',
        r'\.py\b'
    ]
    for pattern in code_patterns:
        if re.search(pattern, lowered):
            return True, clean_query

    # 4. Check general programming questions (e.g., "How to reverse an array?", "What is recursion?")
    # If the user asks a generic programming or documentation question and didn't mention another language/forbidden topic,
    # treat it as a Python query intent.
    generic_prog_terms = [
        "function", "variable", "loop", "array", "list", "dictionary", "hashmap", "string",
        "class", "object", "inheritance", "polymorphism", "recursion", "algorithm", "data structure",
        "file io", "error handling", "exception", "async", "thread", "api", "json", "regex",
        "unit test", "debugging", "memory leak", "stack overflow", "binary search", "sort"
    ]
    for term in generic_prog_terms:
        if term in lowered:
            return True, clean_query

    # 5. Math questions without Python code context (e.g. "What is 10 + 20?") -> Reject
    # Unless it asks "How to do addition in Python?"
    math_pattern = r'^\s*[\d\s\+\-\*\/\(\)\^\.]+\s*\??\s*$'
    if re.match(math_pattern, lowered):
        return False, REFUSAL_MESSAGE

    # Default fallback: If it's ambiguous and doesn't explicitly touch Python, reject with standard refusal message
    return False, REFUSAL_MESSAGE
