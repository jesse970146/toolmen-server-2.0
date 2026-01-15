import os

from resources.lab import LabModel
from schemas.lab import LabSchema


lab_schema = LabSchema()

def default_lab():
    default_lab = {'name': "Toolmen"}
    lab = lab_schema.load(default_lab)
    lab.save_to_db()