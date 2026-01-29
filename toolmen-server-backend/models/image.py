from db import db
#! from models.workspace import WorkspaceModel
from sqlalchemy.exc import IntegrityError
from flask import abort

class ImageModel(db.Model):
    __tablename__ = 'image'

    name = db.Column(db.String(80), primary_key=True)
    value = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(256), default="")

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_public(cls):
        return cls.query.filter_by(public=True).all()

    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, message="Delete failed: There are still workspaces using this image.")
