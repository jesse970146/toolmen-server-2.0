from db import db
from models.workspace import WorkspaceModel
# from models.image import ImageModel
from sqlalchemy.exc import IntegrityError
from flask import abort

class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(128))
    email = db.Column(db.String(64))
    quota = db.Column(db.Integer, default=3)
    is_admin = db.Column(db.Boolean, default=False)
    actived = db.Column(db.Boolean, default=False)
    lab_name = db.Column(db.String(80), db.ForeignKey("lab.name", ondelete='RESTRICT'), nullable=False)
    workspaces = db.relationship('WorkspaceModel',  backref='user', lazy='dynamic')


    @classmethod
    def find_by_username(cls, username: str) -> "UserModel":
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    @classmethod
    def find_by_id(cls, _id: int) -> "UserModel":
        return cls.query.filter_by(id=_id).first()

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> None:
        try:
            db.session.delete(self)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, message="Delete failed: There are still workspaces belonging to this user.")
        
    # def update_to_db(self):
    #     self.query.filter_by(id=self.id).update(self, synchronize_session=False)
    #     db.session.commit()