from ma import ma, exceptions
from marshmallow import  EXCLUDE
from models.user import UserModel
from schemas.workspace import WorkspaceSchema
from schemas.image import ImageSchema
# from models.lab import LabModel
from db import db

class UserSchema(ma.SQLAlchemyAutoSchema):
    workspace = ma.Nested(WorkspaceSchema, many=True)
    image = ma.Nested(ImageSchema, many=True)
    class Meta:
        model = UserModel
        load_instance = True
        load_only = ("activation_code")
        dump_only = ("id", "password")
        include_fk = True
        include_relationships = True
        sqla_session = db.session
        unknown = EXCLUDE
