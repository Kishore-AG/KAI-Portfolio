from sqlalchemy.orm import Session

from models.resume import Resume


class ResumeRepository:

    @staticmethod
    def get_resume(db: Session):
        return db.query(Resume).first()

    @staticmethod
    def create(db: Session, data: dict):
        resume = Resume(**data)

        db.add(resume)
        db.commit()
        db.refresh(resume)

        return resume

    @staticmethod
    def update(
        db: Session,
        resume: Resume,
        data: dict
    ):
        for key, value in data.items():
            setattr(resume, key, value)

        db.commit()
        db.refresh(resume)

        return resume

    @staticmethod
    def delete(
        db: Session,
        resume: Resume
    ):
        db.delete(resume)
        db.commit()