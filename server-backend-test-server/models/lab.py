from typing import List

from db import db
# from models.image import ImageModel
from sqlalchemy.exc import IntegrityError
from flask import abort

class LabModel(db.Model):
    __tablename__ = 'lab'

    name = db.Column(db.String(80), primary_key=True)
    # activation_code = db.Column(db.String(80), nullable=True)
    user = db.relationship("UserModel", lazy="dynamic")
    #? workspaces = db.relationship('WorkspaceModel',  backref='image', lazy='dynamic')
    # store = db.relationship('UserModel', back_populates="items")

    @classmethod
    def find_by_name(cls, name: str) -> "LabModel":
        return cls.query.filter_by(name=name).first()

    # @classmethod
    # def find_by_active_code(cls, activation_code: str) -> "LabModel":
    #     return cls.query.filter_by(activation_code=activation_code).first()

    @classmethod
    def find_all(cls) -> List["LabModel"]:
        return cls.query.all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        # db.session.delete(self)
        # db.session.commit()
        try:
            db.session.delete(self)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, message="Delete failed: There are still users belonging to this lab.")