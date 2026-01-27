from ma import ma, exceptions
from models.user import UserModel
from models.workspace import WorkspaceModel
from models.image import ImageModel
from models.lab import LabModel
from marshmallow import  EXCLUDE

from schemas.user import UserSchema
from db import db


class LabSchema(ma.SQLAlchemyAutoSchema):
    # user = ma.Nested(UserSchema, many=True)
    class Meta:
        model = LabModel
        # load_only = ("activation_code",)
        load_instance = True
        include_fk = True
        include_relationships = False
        sqla_session = db.session
        unknown = EXCLUDE