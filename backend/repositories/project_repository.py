from models.project import Project
from repositories.base_repository import BaseRepository


class ProjectRepository(BaseRepository):

    model = Project