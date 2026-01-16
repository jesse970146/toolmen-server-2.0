from flask import abort, request
from flask_restful import Resource

from functions.decorator import admin_required
from models.lab import LabModel
from schemas.lab import LabSchema

lab_schema = LabSchema()
lab_list_schema = LabSchema(many=True)

# /lab/<string:lab_name>
class Lab(Resource):

    @classmethod
    @admin_required()
    def delete(self, lab_name: str):
        lab = LabModel.find_by_name(lab_name)
        if not lab:
            abort(404, message="Lab not found")

        lab.delete_from_db()
        return {'message': "Lab deleted."}, 200
        

# /labs
class LabList(Resource):
    @admin_required()
    def get(self):
        return {'labs': lab_list_schema.dump(LabModel.find_all())}, 200

    @admin_required()
    def post(cls):
        lab_json = request.get_json()
        lab_data = lab_schema.load(lab_json)

        if LabModel.find_by_name(lab_data.name):
            abort(400, message=f"An lab with name '{lab_data.name}' already exists.")

        try:
            lab_data.save_to_db()
        except:
            abort(500, message=f"An error occurred during creating the lab.")
        
        return {'message': "Lab created"}, 201
    