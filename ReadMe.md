<div align="center">

#  KAI OS
### AI-Powered Operating System Portfolio

A full-stack, dynamically manageable developer portfolio with a built-in AI assistant that can answer questions about the projects, skills, and experience inside it — in real time.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-red?style=flat)](https://www.sqlalchemy.org/)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-F55036?style=flat)](https://groq.com/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

</div>

---

## Overview

**KAI OS** reimagines the traditional portfolio site as a small, self-contained *operating system*: a public-facing interface that presents projects, research, skills, education, and certifications, backed by a private **admin dashboard** for managing all of that content without touching code, and an integrated **AI assistant ("KAI")** that can converse with visitors about the portfolio's contents using retrieval-augmented generation.

It's built as a decoupled system — a FastAPI backend exposing a REST API, and a modular vanilla JavaScript frontend that consumes it — so the two can be developed, deployed, and scaled independently.

---

## ✨ Key Features

- **Dynamic Content Management** — Projects, research, skills, education, certifications, and resume are all stored in a database and editable through a dedicated admin panel, not hardcoded into the frontend.
- **AI Portfolio Assistant (KAI)** — A conversational assistant that classifies visitor intent, retrieves relevant portfolio data, builds context, and generates grounded answers via the Groq LLM API.
- **Secure Admin Authentication** — JWT-based login (OAuth2 password flow) with hashed credentials via `passlib`/`bcrypt`.
- **File Uploads** — Support for avatar, project, and resume file uploads, served through a dedicated static endpoint.
- **Modular Frontend Architecture** — Feature-based modules (projects, skills, education, certifications, research, contact, home) with a lightweight custom router and state manager — no framework overhead.
- **Separate Admin SPA** — An isolated admin interface (`/frontend/admin`) with its own pages, components, and services for managing all portfolio data.
- **REST API** — Clean, versioned FastAPI routes for every resource, with auto-generated interactive docs (Swagger / ReDoc).

---

## 🏗️ Architecture

```
KAI-OS/
├── backend/                  # FastAPI application
│   ├── app/                  # App entrypoint (main.py)
│   ├── api/routes/           # REST endpoints (auth, admin, projects, skills, etc.)
│   ├── ai/                   # KAI assistant pipeline
│   │   ├── intent_classifier.py
│   │   ├── retriever.py
│   │   ├── context_builder.py
│   │   ├── prompt_builder.py
│   │   ├── ranker.py
│   │   ├── explainer.py
│   │   └── providers/groq.py # LLM provider (Groq / Llama 3.3)
│   ├── core/                 # Config & security (JWT, settings)
│   ├── database/             # SQLAlchemy engine & session
│   ├── models/                # ORM models
│   ├── repositories/          # Data access layer
│   ├── schemas/               # Pydantic request/response schemas
│   ├── services/               # Business logic
│   ├── uploads/                 # Uploaded media (avatar, projects, resume)
│   └── create_admin.py          # CLI script to bootstrap an admin user
│
└── frontend/                  # Vanilla JS SPA
    ├── modules/                # Feature modules (home, projects, skills, etc.)
    ├── services/                # API client wrappers per resource
    ├── components/, shared/     # Reusable UI pieces
    ├── assistant/                # KAI chat widget
    ├── admin/                     # Separate admin dashboard SPA
    ├── styles/                     # Base, layout, component, animation CSS
    └── js/                         # Router, state management, entrypoints
```

### How the AI assistant works

1. **Intent Classifier** — determines what the visitor is asking about (projects, skills, experience, etc.).
2. **Retriever** — pulls the relevant records from the database.
3. **Context Builder** — assembles retrieved data into a structured context block.
4. **Prompt Builder** — combines the visitor's message with context into a final prompt.
5. **Groq Provider** — sends the prompt to Llama 3.3 (70B) via the Groq API and returns a grounded answer.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | FastAPI |
| ORM / Database | SQLAlchemy, SQLite |
| Auth | OAuth2 + JWT (`python-jose`), `passlib[bcrypt]` |
| AI / LLM | Groq API (Llama 3.3 70B), ChromaDB (vector storage) |
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Server | Uvicorn (ASGI) |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- A [Groq API key](https://console.groq.com/) for the AI assistant

### 1. Clone the repository

```bash
git clone https://github.com/Kishore-AG/KAI-Portfolio
cd KAI-OS
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file inside `backend/` with the following keys:

```env
DATABASE_URL=sqlite:///./portfolio.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=your-groq-api-key
```

### 4. Create an admin user

```bash
python create_admin.py
```

### 5. Run the backend server

```bash
cd app
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

### 6. Serve the frontend

Open `frontend/index.html` with a local static server (e.g. the VS Code "Live Server" extension on port `5500`, which is already whitelisted in CORS), or serve it with any static file server of your choice.

The admin dashboard is available at `frontend/admin/index.html`.

---

## 📡 API Overview

| Resource | Endpoint prefix |
|---|---|
| Authentication | `/auth` |
| Admin | `/admin` |
| Profile | `/profile` |
| Projects | `/project` |
| Research | `/research` |
| Skills | `/skill` |
| Education | `/education` |
| Certifications | `/certification` |
| Resume | `/resume` |
| File Uploads | `/upload` |
| KAI Assistant | `/kai/chat`, `/kai/explain` |

Full interactive documentation is available via Swagger UI at `/docs` once the server is running.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Built by <strong>Kishore</strong> — an AI-powered take on the personal portfolio.
</div>
