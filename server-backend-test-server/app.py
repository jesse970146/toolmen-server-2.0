from resources.lab import Lab, LabList
from resources.image import Image, ImageList
from resources.workspace import Workspace, WorkspaceList, WorkspaceLists

from resources.user import  UserLogin, User, UserLogout, TokenRefresh, UserList
from resources.ownership import ownership
from resources.node import node
from blacklist import BLACKLIST
from default_admin import default_admin
from default_lab import default_lab
from default_image import default_image

from ma import ma
from db import db
import os
from flask import Flask, jsonify, redirect
from flask_cors import CORS
from flask_restful import Api
from flask_jwt_extended import JWTManager
from marshmallow import ValidationError
from dotenv import load_dotenv


load_dotenv(".env")


app = Flask(__name__)

app.config.from_object("default_config")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config["JWT_BLOCKLIST_TOKEN_CHECKS"] = ["access", "refresh"]
CORS(app, origins=[
    "https://server.toolmen.bime.ntu.edu.tw"
])
# open local cors for local test
# CORS(app, origins=[
#     "http://localhost:3000"
# ])

api = Api(app)
# cors = CORS(app)
# CORS(app, origins=["http://server.toolmen.bime.ntu.edu.tw"], supports_credentials=True)
# CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

jwt = JWTManager(app)

frontend_base_url = os.getenv("FRONTEND_BASE_URL")


# @app.before_first_request
# def create_tables():
#     db.create_all()


# @app.before_first_request
# def create_first_user():
#     default_admin()


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLACKLIST

# Jesse新增
# Token 過期
# @jwt.expired_token_loader
# def expired_token_callback(jwt_header, jwt_payload):
#     return jsonify({"msg": "Token has expired"}), 401

# # 未授權訪問處理（例如沒帶 token）
# @jwt.unauthorized_loader
# def unauthorized_callback(error):
#     return jsonify({"msg": "Missing or invalid token"}), 401

# # 無效 token 處理（損壞、偽造）
# @jwt.invalid_token_loader
# def invalid_token_callback(error):
#     return jsonify({"msg": "Invalid token"}), 422
# Jesse新增

@app.errorhandler(ValidationError)
def handle_marshmallow_validation(err):
    return jsonify(err.messages), 400


@app.errorhandler(404)
def page_not_found(e):
    return redirect(frontend_base_url+"/error?time=5")


@app.errorhandler(500)
def internal_error(e):
    return redirect(frontend_base_url+"/error?time=5")

# @app.errorhandler(Exception)
# def internal_error(e):
#     return redirect(frontend_base_url+"/error?time=5")

api.add_resource(WorkspaceLists, '/workspaces/<int:user_id>')
api.add_resource(Workspace, '/workspace/<string:name>')
api.add_resource(WorkspaceList, '/workspaces')


api.add_resource(Image, '/image/<string:image_name>')
api.add_resource(ImageList, '/images')

api.add_resource(ownership, '/ownership')
api.add_resource(node, '/node')


api.add_resource(Lab, "/lab/<string:lab_name>")
api.add_resource(LabList, "/labs")


api.add_resource(User, "/user/<int:user_id>")
api.add_resource(UserList, '/users')

api.add_resource(UserLogin, "/login")
api.add_resource(UserLogout, "/logout")

api.add_resource(TokenRefresh, "/refresh")


if __name__ == "__main__":
    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        db.create_all()
        default_lab()
        default_admin()
        default_image()

    app.run(port=8080, host='0.0.0.0')
