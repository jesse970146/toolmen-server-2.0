import secrets
import requests
import time
import os
from sqlalchemy.orm.exc import ObjectDeletedError
from flask import abort
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
# from requests import request
from marshmallow import ValidationError
from models.workspace import WorkspaceModel
from models.user import UserModel
from models.image import ImageModel
from functions.k8s_api import (create_namespace, create_pod, create_service, create_ingress,
                               delete_pod, delete_service, delete_ingress
                               )
from functions.decorator import admin_required, active_required
from schemas.workspace import WorkspaceSchema
from schemas.user import UserSchema
from datetime import datetime
api_k8s_base_url = os.getenv('API_K8S_BASE_URL')
# api_k8s_base_url = "http://localhost:30080"
workspace_schema = WorkspaceSchema()
workspace_list_schema = WorkspaceSchema(many=True)
user_schema = UserSchema()


class Workspace(Resource):
    @active_required()
    def put(self, name): # restart
        if not WorkspaceModel.find_by_name(name):
            abort(404, message=f"Workspace '{name}' not found.")

        workspace = WorkspaceModel.find_by_name(name)

        if workspace.user_name != UserModel.find_by_id(get_jwt_identity()).username and  (not UserModel.find_by_id(get_jwt_identity()).is_admin) :
            abort(401, message="Unauthorized")

        

        try:
            r = requests.post(f'{api_k8s_base_url}/restart', json={
                "name": name,
            })
            if not r.status_code == requests.codes.ok:
                abort(500)
        except Exception as e:
            abort(500, message=str(e))

        if workspace:
            workspace.create_time = datetime.now()
            workspace.save_to_db()
            return {'message': 'Item restart.'}, 200
        abort(404, message="Workspace Not Found")

    @jwt_required()
    @active_required()
    def delete(self, name): # delete
        if not WorkspaceModel.find_by_name(name):
            abort(404, message=f"Workspace '{name}' not found.")

        workspace = WorkspaceModel.find_by_name(name)

        current_user = UserModel.find_by_id(get_jwt_identity())
        if workspace.user_name != current_user.username and (not current_user.is_admin):
            abort(401, message="Unauthorized")
        # if workspace.user_name != UserModel.find_by_id(get_jwt_identity()).username and  (not UserModel.find_by_id(get_jwt_identity()).is_admin) :
        #     abort(401, message="Unauthorized")
        elif current_user.is_admin:
            try:
                r = requests.post(f'{api_k8s_base_url}/delete', json={
                    "name": name,
                })
                if not r.status_code == requests.codes.ok:
                    abort(500)
            except Exception as e:
                pass
        else:
            try:
                r = requests.post(f'{api_k8s_base_url}/delete', json={
                    "name": name,
                })
                if not r.status_code == requests.codes.ok:
                    abort(500)
            except Exception as e:
                abort(500, message=str(e))

        if workspace:
            workspace.delete_from_db()
            return {'message': 'Item deleted.'}, 200
        abort(404, message="Workspace Not Found")


class WorkspaceList(Resource):
    @jwt_required()
    def get(self): # list workspace
        username = UserModel.find_by_id(get_jwt_identity()).username
        workspaces = WorkspaceModel.find_by_username(username)
        # print(workspaces_list)
        for ws in workspaces:
            pod_name = ws.name
            try:
                response = requests.get(f'{api_k8s_base_url}/api/pod_status/{pod_name}')  # 替換為你的 API 位址
                if response.status_code == 200:
                    data = response.json()
                    ws.status = data["status"]
                    print("API 回傳資料：", data)
                else:
                    print("API 請求失敗", response.status_code)
            except :
                ws.status = f"unknown"
                ws.save_to_db()

        workspaces_list =  workspace_list_schema.dump(workspaces)
        workspaces_list.sort(key=lambda w: w['create_time'], reverse=True)
        
        if UserModel.find_by_id(get_jwt_identity()).is_admin:
    # 先輪尋一遍做更新
            all_workspaces = WorkspaceModel.find_all()
            
            for ws in all_workspaces:
                try:
                    # 1. 這裡是最容易報錯的地方，必須放在 try 裡面
                    # 如果 ws 在資料庫被刪除，讀取 .name 會觸發 ObjectDeletedError
                    pod_name = ws.name 
                    
                    # 2. 執行 API 請求 (這裡可以用內層 try 或直接寫，視您是否要細分錯誤)
                    try:
                        response = requests.get(f'{api_k8s_base_url}/api/pod_status/{pod_name}', timeout=5) # 建議加上 timeout 避免卡住
                        
                        if response.status_code == 200:
                            data = response.json()
                            ws.status = data["status"]
                            print("API 回傳資料：", data)
                        else:
                            print("API 請求失敗", response.status_code)
                            ws.status = "unknown"
                            
                    except Exception as e:
                        # 這是處理 requests連線錯誤 (例如 K8s API 掛掉)
                        print(f"K8s API 連線錯誤: {e}")
                        ws.status = "unknown"

                    # 3. 只有當物件還存在時，才執行存檔
                    ws.save_to_db()

                except ObjectDeletedError:
                    # 這是本次修復的重點：
                    # 如果發現這筆 Workspace 已經被刪除了，就直接忽略 (continue)，不要讓程式崩潰
                    print("偵測到 Workspace 已被刪除，跳過更新。")
                    continue
                except Exception as e:
                    # 捕捉其他未預期的錯誤，避免迴圈中斷
                    print(f"更新 Workspace 時發生未預期錯誤: {e}")
                    continue

            # 迴圈結束後，繼續處理列表回傳
            all_workspaces_list = workspace_list_schema.dump(all_workspaces)
            # 注意：這裡 dump 時，如果 list 中仍包含已刪除的 stale objects 可能會再次報錯
            # 但因為上面的迴圈通常會觸發刷新，此時 all_workspaces 記憶體中的物件應該已更新或標記
            # 若擔心 dump 報錯，建議重新 fetch 一次，或在 dump 前過濾掉被標記刪除的物件
            
            all_workspaces_list.sort(key=lambda w: w['create_time'], reverse=True)
            
            return {'workspaces': workspaces_list, 'all_workspaces': all_workspaces_list}, 200
        
        return {'workspaces': workspaces_list}, 200
    
    @active_required()
    def post(self): # create
        user_id = get_jwt_identity()
        user = UserModel.find_by_id(user_id)
        user = user_schema.dump(user)
        workspace_json = request.get_json()
        # print(workspace_json)
        name = workspace_json.get('name', '')  # 若沒有傳 name，預設為空字串

        Selected_image = ImageModel.find_by_name(workspace_json.get('image', ''))
        
        if not name:  # 使用time.time()當環境名稱
            w_name = (user['username'] + "-" + str(int(time.time()))).lower()
        else:     # 使用者指定自己的環境名稱
            w_name = (user['username'] + "-" + name).lower()

        if WorkspaceModel.find_by_name(w_name):
            abort(400, message=f"An item with name '{w_name}' already exists.")
        # token = secrets.token_urlsafe(32)

        # 先存入db
        workspace_json['user_name'] = user['username']
        workspace_json['name'] = w_name
        workspace_json['status'] = "Creating"
        workspace_json['image_name'] = workspace_json.get('image', '')

        try:
            workspace = workspace_schema.load(workspace_json)       
            workspace.save_to_db()
        except:
            abort(500, message="An error occurred inserting the workspace to DB.")

        time.sleep(3) 

        try:
            r = requests.post(f'{api_k8s_base_url}/create', json={
                "name": w_name,
                "username": user['username'],
                "password": user['password'],
                "image": Selected_image.value,
                "version": Selected_image.name,
                "server":  workspace_json['server'],
                # "server":  'server',
                "lab": user['lab_name']
            })
            if not r.status_code == requests.codes.ok:
                abort(500)
        except Exception as e:
            abort(500, message=str(e))

        return workspace_schema.dump(workspace), 201
