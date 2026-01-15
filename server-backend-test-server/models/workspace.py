from db import db

from datetime import datetime


class WorkspaceModel(db.Model):
    __tablename__ = 'workspace'

    name = db.Column(db.String(80), primary_key=True)
    status = db.Column(db.String(64), default="unknown")
    server = db.Column(db.String(16), default="unknown")
    # token = db.Column(db.String(64), default="")
    user_name = db.Column(db.String(80), db.ForeignKey('user.username', ondelete='RESTRICT'), nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now)
    image_name = db.Column(db.String(80), db.ForeignKey('image.name', ondelete='RESTRICT'), nullable=False)
   

    @classmethod
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_username(cls, user_name):
        return cls.query.filter_by(user_name=user_name).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
