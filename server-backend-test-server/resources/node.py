from flask import jsonify, abort
from flask_restful import  Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
import requests
import os
from flask_restful import Resource
from models.user import UserModel
from schemas.user import UserSchema

api_k8s_base_url = os.getenv('API_K8S_BASE_URL')
# api_k8s_base_url = "http://localhost:30080"
user_schema = UserSchema()

class node(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)
        user = user_schema.dump(user)
        lab = user['lab_name']
        try:
            r = requests.get(f'{api_k8s_base_url}/node/{lab}')
            if not r.status_code == requests.codes.ok:
                abort(500)
        except Exception as e:
            abort(500, message = str(e))
        # 取得原始請求路徑
        node_list = r.json()
        # print(r)  
        return jsonify({"nodes": node_list})




