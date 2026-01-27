from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request

from models.user import UserModel
from models.workspace import WorkspaceModel
from urllib.parse import urlparse


class ownership(Resource):
    @jwt_required()
    def get(self):
        original_path = request.headers.get("X-Auth-Request-Redirect", "")
        # 取得原始請求路徑
        
        path = urlparse(original_path).path
        parts_set = {p for p in path.split("/") if p}
        # 從 JWT identity 取得 username（或 user id）
        username = UserModel.find_by_id(get_jwt_identity()).username
        
        # 從資料庫或模型取得該使用者擁有的 workspaces
        workspaces = WorkspaceModel.find_by_username(username)

        workspace_names = {ws.name for ws in workspaces}   
        
        # 檢查 pod_name 是否屬於使用者
        if parts_set & workspace_names:   # 交集非空
            return {"message": "Authorized"}, 200

        return {"message": "Forbidden"}, 403



