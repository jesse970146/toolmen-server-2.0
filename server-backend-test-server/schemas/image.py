from ma import ma, exceptions
from models.image import ImageModel
from models.user import UserModel
from models.workspace import WorkspaceModel
from marshmallow import  EXCLUDE
from db import db


class ImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ImageModel
        load_instance = True
        include_fk = True
        include_relationships = False
        sqla_session = db.session
        unknown = EXCLUDE