from flask_restful import Resource, abort
from flask import request
from flask_cors import cross_origin

from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    get_jwt,
)
from functions.strings import gettext
from functions.decorator import admin_required, active_required
from functions.user_check import user_password_modify, revise_user, active_check 
from functions.send_email import send_account_created_email
from functions.random_password import generate_password
from models.user import UserModel
from schemas.user import UserSchema
from blacklist import BLACKLIST
from db import db
from passlib.hash import sha512_crypt

user_schema = UserSchema()
user_list_schema = UserSchema(many=True)

# class UserRegister(Resource):
#     @classmethod
#     def post(cls):
#         user_json = request.get_json()
#         user_json["username"] = user_json.get("username", "").strip().replace(" ", "") # make sure the username doesn't have space
#         user = user_schema.load(user_json)
#         if UserModel.find_by_username(user.username):
#             abort(400, message=gettext("user_username_exists"))
#         password = generate_password(length=10, use_special=False) # generate random password
#         user.password = sha512_crypt.hash(password)

#         send_account_created_email(  # send email to the user 
#             to_email = user_json["email"],
#             user = user_json.get("username", ""),
#             default_password = password,
#             url="https://server.toolmen.bime.ntu.edu.tw",
#             event = "create"
#         )
#         # revise_user(user, user_json)
#         # active_check(user, user)
#         user.register_from = 'E-mail'
#         user.save_to_db()

#         access_token = create_access_token(identity=user.id, fresh=False)
#         refresh_token = create_refresh_token(user.id)
#         return {'uid': user.id, "access_token": access_token, "refresh_token": refresh_token, "user_info": user_schema.dump(user)}, 201
#         # return {"message": gettext("user_registered")}, 201



class User(Resource):
    @classmethod
    @jwt_required()
    def put(self, user_id: int):
        if not UserModel.find_by_id(user_id):
            abort (400, message= gettext("user_not_found"))
        
        user_json = request.get_json()
        # print(user_json)
        user_revising = UserModel.find_by_id(user_id)
        current_user = UserModel.find_by_id(get_jwt_identity())
        # 忘記密碼
        if current_user.is_admin and (user_json["event"] == "forgetPassword"):
            # admin_privileges
            resetpassword = generate_password(length=10, use_special=False)
            hashresetpassword = sha512_crypt.hash(resetpassword)
            user_revising.password = hashresetpassword
            
            send_account_created_email(
                to_email = user_revising.email,
                user = user_revising.username,
                default_password = resetpassword,
                url="https://server.toolmen.bime.ntu.edu.tw",
                event = "reset"
            )
        # 更新資訊
        elif current_user.is_admin and (user_json["event"] == "updateProfile"):
            # admin_privileges
            # 安全更新欄位
            user_revising.email = user_json.get("email", user_revising.email)
            user_revising.quota = user_json.get("quota", user_revising.quota)
            user_revising.is_admin = user_json.get("is_admin", user_revising.is_admin)
            user_revising.actived = user_json.get("actived", user_revising.actived)

        # 使用者更改密碼  
        else:
            if current_user.id is not user_revising.id:
                abort (403, message= "Permission denied")
            if  not sha512_crypt.verify(user_json["oldPassword"], user_revising.password):
                abort (403, message= "Wrong old password")
            user_password_modify(user_revising, user_json)
        # if not user_revising.actived:
        #     active_check(user_revising, user)
            
        user_revising.save_to_db()
        
        access_token = create_access_token(identity=user_revising.id, fresh=False)
        refresh_token = create_refresh_token(user_revising.id)
        return {'uid': user_revising.id, "access_token": access_token, "refresh_token": refresh_token, "user_info": user_schema.dump(user_revising)}, 201


    @classmethod
    @jwt_required()
    def get(self, user_id: int):
        # print(user_id)
        user = UserModel.find_by_id(user_id)
        current_user = UserModel.find_by_id(get_jwt_identity())
        # print("JWT identity:", get_jwt_identity())
        # print("current_user.id:", current_user.id)
        # print("user_id param:", user_id)
        if not user:
            abort (404, message= gettext("user_not_found"))
            
        if current_user.is_admin:
            return user_schema.dump(user), 200
        # elif current_user.id is not user_id:
        elif current_user.id != user_id:
            abort (403, message= "Permission denied")
        return user_schema.dump(user), 200

    @classmethod
    @admin_required()
    def delete(cls, user_id: int):
        claims = get_jwt()
        user = UserModel.find_by_id(user_id)
        if not user:
            abort (404, message= gettext("user_not_found"))

        user.delete_from_db()
        return {"message": gettext("user_deleted")}, 200

class UserList(Resource):
    @classmethod
    @jwt_required()
    def get(self):

        username = UserModel.find_by_id(get_jwt_identity()).username
        user = user_schema.dump(UserModel.find_by_username(username))
            
        # user.sort(key=lambda w: w['create_time'], reverse=True)
        if UserModel.find_by_id(get_jwt_identity()).is_admin:
            all_users = user_list_schema.dump(
                UserModel.find_all())
            # all_users.sort(key=lambda w: w['create_time'], reverse=True)

            return {'users': user, 'all_users': all_users}, 200
        return {'users': user}, 200
    
    @admin_required()
    def post(self):
        user_json = request.get_json()
        user_json["username"] = user_json.get("username", "").strip().replace(" ", "") # make sure the username doesn't have space
        user = user_schema.load(user_json)
        if UserModel.find_by_username(user.username):
            abort(400, message=gettext("user_username_exists"))
        password = generate_password(length=10, use_special=False) # generate random password
        user.password = sha512_crypt.hash(password)

        send_account_created_email(  # send email to the user 
            to_email = user_json["email"],
            user = user_json.get("username", ""),
            default_password = password,
            url="https://server.toolmen.bime.ntu.edu.tw",
            event = "create"
        )
        # revise_user(user, user_json)
        # active_check(user, user)
        user.register_from = 'E-mail'
        user.save_to_db()

        access_token = create_access_token(identity=user.id, fresh=False)
        refresh_token = create_refresh_token(user.id)
        return {'uid': user.id, "access_token": access_token, "refresh_token": refresh_token, "user_info": user_schema.dump(user)}, 201
        # return {"message": gettext("user_registered")}, 201


class UserLogin(Resource):
    @classmethod
    # @cross_origin(origins="http://server.toolmen.bime.ntu.edu.tw")
    def post(self):
        user_json = request.get_json()
        
        # Jesse 新增
        username = user_json.get("username")
        password = user_json.get("password")
        user = UserModel.find_by_username(username)
        # print(check_password_hash(user.password, password))
        # Jesse 新增

        # Jesse 註解
        # user_data = user_schema.load(user_json)
        # print(user_data.password)
        # user = UserModel.find_by_username(user_data.username)
        # print(check_password_hash(user.password, user_data.password))
        # Jesse 註解
        # print(user.password)
        if user and user.password and  sha512_crypt.verify(password, user.password):
            access_token = create_access_token(identity=str(user.id), fresh=True)
            refresh_token = create_refresh_token(user.id)
            return {'uid': user.id, "access_token": access_token, "refresh_token": refresh_token, "user_info": user_schema.dump(user)}, 200

        abort (401, message= gettext("user_invalid_credentials"))


class UserLogout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]  # jti is "JWT ID", a unique identifier for a JWT.
        user_id = get_jwt_identity()
        BLACKLIST.add(jti)
        return {"message": "{} successfully logged out".format(user_id)}, 200

class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        return {"user": current_user, "access_token": new_token}, 200
    

