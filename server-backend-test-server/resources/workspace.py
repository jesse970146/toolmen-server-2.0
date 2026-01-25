import os
import re
import time
import requests

from sqlalchemy.orm.exc import ObjectDeletedError

from flask import abort
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from models.user import UserModel
from models.image import ImageModel
from models.workspace import WorkspaceModel

from schemas.user import UserSchema
from schemas.workspace import WorkspaceSchema
from datetime import datetime, timezone, timedelta
from functions.decorator import admin_required, active_required

api_k8s_base_url = os.getenv('API_K8S_BASE_URL')

workspace_schema = WorkspaceSchema()
workspace_list_schema = WorkspaceSchema(many=True)
user_schema = UserSchema()

class Workspace(Resource):
    @active_required()
    def put(self, name): # restart

        workspace = WorkspaceModel.find_by_name(name)
        if not workspace:
            abort(404, message=f"Workspace '{name}' not found.")

        current_user = UserModel.find_by_id(get_jwt_identity())    

        if workspace.user_name != current_user.username and  (not current_user.is_admin) :
            abort(401, message="Unauthorized")

        else:

            try:
                r = requests.post(f'{api_k8s_base_url}/restart', json={
                    "name": name,
                })
                if not r.status_code == requests.codes.ok:
                    abort(500)
            except Exception as e:
                abort(500, message=str(e))

        workspace.create_time = datetime.now()
        workspace.save_to_db()
        return {'message': 'Workspace restart.'}, 200


    @jwt_required()
    @active_required()
    def delete(self, name): # delete
        workspace = WorkspaceModel.find_by_name(name)
        
        if not workspace:
            abort(404, message=f"Workspace '{name}' not found.")

        
        current_user = UserModel.find_by_id(get_jwt_identity())
        if workspace.user_name != current_user.username and (not current_user.is_admin):
            abort(401, message="Unauthorized")
        # if workspace.user_name != UserModel.find_by_id(get_jwt_identity()).username and  (not UserModel.find_by_id(get_jwt_identity()).is_admin) :
        #     abort(401, message="Unauthorized")
        else:
            workspace.status = "Deleting"
            workspace.save_to_db()

            try:
                r = requests.post(f'{api_k8s_base_url}/delete', json={
                    "name": name,
                })
                if not r.status_code == requests.codes.ok:
                    abort(500)
            except Exception as e:
                abort(500, message=str(e))

        workspace.delete_from_db()
        return {'message': 'Workspace deleted.'}, 200


class WorkspaceList(Resource):
    @admin_required()
    def get(self): # list workspace
        # 先輪尋一遍做更新
        all_workspaces = WorkspaceModel.find_all()
        
        for ws in all_workspaces:
            if ws.status == "":
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
                        else:
                            print("API 請求失敗", response.status_code)
                            ws.status = f"unknown"
                            ws.save_to_db()

                    except Exception as e:
                        # 這是處理 requests連線錯誤 (例如 K8s API 掛掉)
                        ws.status = f"unknown"
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
        all_workspaces_list.sort(key=lambda w: w['create_time'], reverse=True)
        
        return {'all_workspaces': all_workspaces_list}, 200
        
    
    @active_required()
    def post(self): # create
        user_id = get_jwt_identity()
        user_data = user_schema.dump(UserModel.find_by_id(user_id))
        workspace_json = request.get_json()

        # name 只保留 a-z0-9-
        name = workspace_json.get('name', '')  # 若沒有傳 name，預設為空字串
        name = re.sub(r"[^a-z0-9-]", "", name)
        # 去除開頭與結尾的 -
        name = name.strip("-")

        Selected_image = ImageModel.find_by_name(workspace_json.get('image', ''))
        
        if not name:  # 使用time.time()當環境名稱
            workspace_name = (user_data['username'] + "-" + str(int(time.time()))).lower()
        else:     # 使用者指定自己的環境名稱
            workspace_name = (user_data['username'] + "-" + name).lower()

        if WorkspaceModel.find_by_name(workspace_name):
            abort(400, message=f"An item with name '{workspace_name}' already exists.")

        # 先存入db
        workspace_json['user_name'] = user_data['username']
        workspace_json['name'] = workspace_name
        workspace_json['status'] = "Creating"
        workspace_json['image_name'] = workspace_json.get('image', '')

        try:
            workspace = workspace_schema.load(workspace_json)
            workspace.create_time = datetime.now()
            workspace.save_to_db()
        except:
            abort(500, message="An error occurred inserting the workspace to DB.")

        # time.sleep(3) 

        try:
            r = requests.post(f'{api_k8s_base_url}/create', json={
                "name": workspace_name,
                "username": user_data['username'],
                "password": UserModel.find_by_id(user_id).password,
                "image": Selected_image.value,
                "version": Selected_image.name,
                "server":  workspace_json['server'],
                "lab": user_data['lab_name']
            })
            if not r.status_code == requests.codes.ok:
                abort(500)

            # 創立成功在更改狀態為無狀態
            workspace_json['status'] = ""
            workspace = workspace_schema.load(workspace_json)
            workspace.save_to_db()

        except Exception as e:
            abort(500, message=str(e))

        return {'message': "Workspace created"}, 201      

class WorkspaceLists(Resource):
    @jwt_required()
    def get(self, user_id: int): # list workspace
        username = UserModel.find_by_id(user_id).username
        workspaces = WorkspaceModel.find_by_username(username)
        
        for ws in workspaces:
            
            if ws.status == "":
                try:
                    pod_name = ws.name
                    try:
                        response = requests.get(f'{api_k8s_base_url}/api/pod_status/{pod_name}')  # 替換為你的 API 位址
                        if response.status_code == 200:
                            data = response.json()
                            ws.status = data["status"]
                        else:
                            print("API 請求失敗", response.status_code)
                            ws.status = f"Unknown"
                            # ws.save_to_db()

                    except Exception as e:
                        ws.status = f"Unknown"
                        # ws.save_to_db()

                except ObjectDeletedError:
                    # 這是本次修復的重點：
                    # 如果發現這筆 Workspace 已經被刪除了，就直接忽略 (continue)，不要讓程式崩潰
                    print("偵測到 Workspace 已被刪除，跳過更新。")
                    continue
                except Exception as e:
                    # 捕捉其他未預期的錯誤，避免迴圈中斷
                    print(f"更新 Workspace 時發生未預期錯誤: {e}")
                    continue

        workspaces_list =  workspace_list_schema.dump(workspaces)
        workspaces_list.sort(key=lambda w: w['create_time'], reverse=True)
        
        return {'workspaces': workspaces_list}, 200
