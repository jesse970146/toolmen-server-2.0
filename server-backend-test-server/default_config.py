from datetime import timedelta

DEBUG = False\


# SQLALCHEMY_DATABASE_URI = "sqlite:///database/data.sqlite"
# basedir = os.path.abspath(os.path.dirname(__file__))
# postgresql://使用者:密碼@主機:埠號/資料庫名稱 
SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@192.168.23.11:30310/postgres"
SQLALCHEMY_TRACK_MODIFICATIONS = False
PROPAGATE_EXCEPTIONS = True
SECRET_KEY = "change-this-key-in-the-application-config"
JWT_SECRET_KEY = "change-this-key-to-something-different-in-the-application-config"
JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
JWT_BLACKLIST_ENABLED = True
JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
