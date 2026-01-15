from flask import abort, request
from flask_restful import Resource

from functions.strings import gettext
from functions.decorator import admin_required
from models.lab import LabModel
from schemas.lab import LabSchema

lab_schema = LabSchema()
lab_list_schema = LabSchema(many=True)

# /lab/<name>
class Lab(Resource):
    # @classmethod
    # @admin_required()
    # def put(cls, name: str):
    #     lab_json = request.get_json()
    #     lab_dic = LabModel.find_by_name(name)
        
    #     if not lab_dic:
    #         abort(500, message=gettext("creative_activation_code_error"))
            
    #     lab_dic.active_code = lab_json["activation_code"]
    #     lab_dic.save_to_db()
        
    #     return {'message': gettext("Modify_activation_code_success")}, 201
        
    # @classmethod
    # @admin_required()
    # def get(cls, name: str):
    #     lab = LabModel.find_by_name(name)
    #     if not lab:
    #         abort(404, message=gettext("no_lab_name"))
    #     return lab_schema.dump(lab), 200
        
    @classmethod
    @admin_required()
    def delete(self, lab_name: str):
        lab = LabModel.find_by_name(lab_name)
        if not lab:
            abort(404, message=gettext("no_lab_name"))
        lab.delete_from_db()
        return {'message':  gettext("delete_activation_code_success")}, 200
        

# /lab
class LabList(Resource):
    @classmethod
    @admin_required()
    def post(cls):
        lab_json = request.get_json()
        if not LabModel.find_by_name(lab_json["name"]):
            lab_data = lab_schema.load(lab_json)
            lab_data.save_to_db()
            return {'message': "Lab created"}, 201
        abort (403, gettext("lab_name_exist"))
        
    @admin_required()
    def get(self):
        return {'labs': lab_list_schema.dump(LabModel.find_all())}, 200
    

# /lab/verify/<name>
# class LabVerify(Resource):
#     def post(self, name: str):

#         lab_json = request.get_json()
#         lab = LabModel.find_by_name(name)
        
#         if not lab:
#             abort(404, message = gettext("no_lab_name"))
 
#         return {'verify': "successed" if lab_json['activation_code'] == lab.activation_code else "failed"}, 200
