import os
from resources.lab import LabModel
from schemas.lab import LabSchema

lab_schema = LabSchema()

def default_lab():
    # 先檢查是否已存在
    existing = LabModel.find_by_name("Toolmen")
    if  not existing:
        default_data = {"name": "Toolmen"}
        lab = lab_schema.load(default_data)
        lab.save_to_db()
