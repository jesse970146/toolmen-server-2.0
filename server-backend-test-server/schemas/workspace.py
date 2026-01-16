from marshmallow import fields , EXCLUDE
from ma import ma, exceptions
from models.workspace import WorkspaceModel
from models.user import UserModel
from models.image import ImageModel
# from models.lab import LabModel
from db import db


class WorkspaceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = WorkspaceModel
        load_instance = True
        load_only = ()
        include_fk = True
        include_relationships = False
        sqla_session = db.session
        unknown = EXCLUDE

    create_time = fields.Date(format='%B %d, %Y, %I:%M %p')