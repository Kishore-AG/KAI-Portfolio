from repositories.certification_repository import CertificationRepository
from services.base_service import BaseService


class CertificationService(BaseService):
    repository = CertificationRepository