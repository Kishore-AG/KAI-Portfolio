from sqlalchemy.orm import Session


class BaseRepository:

    model = None

    @classmethod
    def get_all(cls, db: Session):
        query = db.query(cls.model)

        if hasattr(cls.model, "display_order"):
            query = query.order_by(cls.model.display_order)

        return query.all()

    @classmethod
    def get_by_id(
        cls,
        db: Session,
        item_id: int
    ):
        return (
            db.query(cls.model)
            .filter(cls.model.id == item_id)
            .first()
        )

    @classmethod
    def create(
        cls,
        db: Session,
        data: dict
    ):
        item = cls.model(**data)

        db.add(item)
        db.commit()
        db.refresh(item)

        return item

    @classmethod
    def update(
        cls,
        db: Session,
        item,
        data: dict
    ):
        for key, value in data.items():
            setattr(item, key, value)

        db.commit()
        db.refresh(item)

        return item

    @classmethod
    def delete(
        cls,
        db: Session,
        item
    ):
        db.delete(item)
        db.commit()