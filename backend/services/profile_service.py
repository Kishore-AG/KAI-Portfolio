from sqlalchemy.orm import Session

from repositories.profile_repository import ProfileRepository
from schemas.profile import ProfileCreate, ProfileUpdate


class ProfileService:

    @staticmethod
    def get_profile(db: Session):
        return ProfileRepository.get_profile(db)

    @staticmethod
    def save_profile(
        db: Session,
        profile_data: ProfileCreate
    ):
        profile = ProfileRepository.get_profile(db)

        if profile:
            return ProfileRepository.update_profile(
                db,
                profile,
                profile_data.model_dump()
            )

        return ProfileRepository.create_profile(
            db,
            profile_data.model_dump()
        )

    @staticmethod
    def update_profile(
        db: Session,
        profile_data: ProfileUpdate
    ):
        profile = ProfileRepository.get_profile(db)

        if not profile:
            return None

        return ProfileRepository.update_profile(
            db,
            profile,
            profile_data.model_dump(exclude_unset=True)
        )