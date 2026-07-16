from repositories.project_repository import ProjectRepository
from services.base_service import BaseService


class ProjectService(BaseService):

    repository = ProjectRepository