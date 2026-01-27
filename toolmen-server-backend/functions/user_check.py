from flask_restful import Resource, abort
from functions.strings import gettext
from werkzeug.security import generate_password_hash

from models.user import UserModel
# from models.lab import LabModel
from schemas.user import UserSchema
from passlib.hash import sha512_crypt

def active_check(user_revising, user_dic):
    # lab = LabModel.find_by_active_code(user_dic.activation_code)
    lab = "Toolmen"
    if lab is None:
        abort (403, message= "Account active fail")
    else:
        user_revising.lab_name = lab.name
        user_revising.actived = True

def revise_user(user_revising, user_json):
    adaptable_info = ['fullname', 'student_id', 'email']
    for column in adaptable_info:
        try:
            setattr(user_revising, column, user_json[column])
        except:
            pass
        
            
    # else:
    #     adaptable_info = ['username', 'fullname', 'student_id', 'email']
    #     try:
    #         if not UserModel.find_by_username(user_json['username']):
    #             for column in adaptable_info:
    #                 setattr(user_revising, column, user_json[column])
    #     except:
    #         abort (403, message= "user_info_register fail or user_username_exists")

def user_password_modify(user_revising, user_dic):
    if not user_dic["newPassword"]:
        return    
    # password_check = generate_password_hash(user_dic["newPassword"])
    password_check = sha512_crypt.hash(user_dic["newPassword"])
    user_revising.password = password_check
