class BaseService:

    repository = None

    @classmethod
    def get_all(cls, db):
        return cls.repository.get_all(db)

    @classmethod
    def get_by_id(
        cls,
        db,
        item_id
    ):
        return cls.repository.get_by_id(
            db,
            item_id
        )

    @classmethod
    def create(
        cls,
        db,
        schema
    ):
        return cls.repository.create(
            db,
            schema.model_dump()
        )

    @classmethod
    def update(
        cls,
        db,
        item_id,
        schema
    ):
        item = cls.repository.get_by_id(
            db,
            item_id
        )

        if not item:
            return None

        return cls.repository.update(
            db,
            item,
            schema.model_dump(
                exclude_unset=True
            )
        )

    @classmethod
    def delete(
        cls,
        db,
        item_id
    ):
        item = cls.repository.get_by_id(
            db,
            item_id
        )

        if not item:
            return False

        cls.repository.delete(
            db,
            item
        )

        return True