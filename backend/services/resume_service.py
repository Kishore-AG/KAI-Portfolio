from repositories.resume_repository import ResumeRepository
from services.base_service import BaseService


class ResumeService(BaseService):
    repository = ResumeRepository