from datetime import timedelta

# test for local
# import os 
# DEBUG = True
# basedir = os.path.abspath(os.path.dirname(__file__))
# SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "database", "data.sqlite")

DEBUG = False
# postgresql://使用者:密碼@主機:埠號/資料庫名稱 
SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@192.168.23.11:30310/postgres"
SQLALCHEMY_TRACK_MODIFICATIONS = False
PROPAGATE_EXCEPTIONS = True
SECRET_KEY = "change-this-key-in-the-application-config"
JWT_SECRET_KEY = "change-this-key-to-something-different-in-the-application-config"
JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
JWT_BLACKLIST_ENABLED = True
JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
