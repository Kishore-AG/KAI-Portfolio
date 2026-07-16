from sqlalchemy.orm import Session

from models.profile import Profile
from models.project import Project
from models.research import Research
from models.skill import Skill
from models.education import Education
from models.certification import Certification
from models.kai_knowledge import KAIKnowledge


class Retriever:

    @staticmethod
    def retrieve(db: Session):

        return {

            "profile": db.query(Profile).all(),

            "projects": db.query(Project).all(),

            "research": db.query(Research).all(),

            "skills": db.query(Skill).all(),

            "education": db.query(Education).all(),

            "certifications": db.query(Certification).all(),

            "knowledge": db.query(KAIKnowledge)
                            .filter(KAIKnowledge.active == True)
                            .all()

        }