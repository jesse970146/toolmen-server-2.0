from flask import  request
from flask_restful import  Resource
import jwt
from models.user import UserModel
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from models.workspace import WorkspaceModel
from schemas.workspace import WorkspaceSchema

workspace_schema = WorkspaceSchema()

from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request

class validate(Resource):
    @jwt_required()
    def get(self):
        original_path = request.headers.get("X-Auth-Request-Redirect", "")
        # 取得原始請求路徑
        try:
            parts = original_path.split("/")

            # 從 JWT identity 取得 username（或 user id）
            username = UserModel.find_by_id(get_jwt_identity()).username
            
            # 從資料庫或模型取得該使用者擁有的 workspaces
            workspaces = [workspace_schema.dump(
                workspace) for workspace in WorkspaceModel.find_by_username(username)]
            print(workspaces)
            # 檢查 pod_name 是否屬於使用者
            for ws in workspaces:
                pod_name = ws.get("name")
                if pod_name in parts:
                    return {"message": "Authorized"}, 200
            return {"message": "Forbidden"}, 403
        except: 
            return {"message": "Forbidden"}, 403



