from resources.user import UserModel
from schemas.user import UserSchema
from passlib.hash import sha512_crypt
from db import db

def default_admin():
    existing = UserModel.find_all()
    if not existing:
        user_schema = UserSchema()
        username = 'admin'
        password = 'admin'
        default_admin = {'username':username, 'password':password, 'fullname':'Administrator',  'lab_name':'Toolmen', 'is_admin':True, 'actived':True}
        user = user_schema.load(default_admin)
        user.password = sha512_crypt.hash(password)
        user.save_to_db()