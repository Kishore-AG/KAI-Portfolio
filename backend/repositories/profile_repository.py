from sqlalchemy.orm import Session

from models.profile import Profile


class ProfileRepository:

    @staticmethod
    def get_profile(db: Session):
        return db.query(Profile).first()

    @staticmethod
    def update_profile(
        db: Session,
        profile: Profile,
        data: dict
    ):
        for key, value in data.items():
            setattr(profile, key, value)

        db.commit()
        db.refresh(profile)

        return profile

    @staticmethod
    def create_profile(
        db: Session,
        data: dict
    ):
        profile = Profile(**data)

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile