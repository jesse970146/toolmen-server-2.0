from ma import ma, exceptions
from marshmallow import  EXCLUDE
from models.user import UserModel
from schemas.workspace import WorkspaceSchema
from schemas.image import ImageSchema

from db import db

class UserSchema(ma.SQLAlchemyAutoSchema):
    # workspace = ma.Nested(WorkspaceSchema, many=True)
    # image = ma.Nested(ImageSchema, many=True)
    class Meta:
        model = UserModel
        load_instance = True
        load_only = ("password",)
        dump_only = ("id",)
        include_fk = True
        # include_relationships = True
        sqla_session = db.session
        unknown = EXCLUDE
