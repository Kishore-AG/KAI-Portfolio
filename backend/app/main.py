from fastapi import FastAPI

from database.db import Base, engine

from api.routes.auth import router as auth_router

from api.routes.admin import router as admin_router

from api.routes.profile import router as profile_router

from api.routes.project import router as project_router

from api.routes.research import router as research_router

from api.routes.skill import router as skill_router

from api.routes.education import router as education_router

from api.routes.certification import router as certification_router

from api.routes.resume import router as resume_router

from api.routes.kai_knowledge import router as kai_knowledge_router
from api.routes import kai_chat

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
import os
import models
from api.routes.upload import router as upload_router

from dotenv import load_dotenv

load_dotenv()

print(models.__file__)

print("Registered tables:", Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

print("Tables created!")

app = FastAPI(
    title="KAI OS API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "https://kishore-ag.netlify.app/admin/login.html",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

app.include_router(admin_router)

app.include_router(profile_router)

app.include_router(project_router)

app.include_router(research_router)

app.include_router(skill_router)

app.include_router(education_router)

app.include_router(certification_router)

app.include_router(resume_router)

app.include_router(kai_knowledge_router)

app.include_router(kai_chat.router)

app.include_router(upload_router)

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

@app.get("/")
def root():
    return {"message": "Welcome to KAI OS Backend 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}