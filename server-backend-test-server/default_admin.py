import os

from resources.user import UserModel
from schemas.user import UserSchema
# from werkzeug.security import generate_password_hash
from passlib.hash import sha512_crypt
from db import db



def default_admin():
    user_schema = UserSchema()
    username = 'admin'
    password = 'admin'
    if not UserModel.find_by_id(1):
        default_admin = {'username':username, 'password':password, 'fullname':'Administrator',  'lab_name':'Toolmen', 'is_admin':True, 'actived':True}
        user = user_schema.load(default_admin)
        user.password = sha512_crypt.hash(password)
        user.save_to_db()