from datetime import timedelta
import os 
DEBUG = True
# SQLALCHEMY_DATABASE_URI = "sqlite:///database/data.sqlite"
basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "database", "data.sqlite")
SQLALCHEMY_TRACK_MODIFICATIONS = False
PROPAGATE_EXCEPTIONS = True
SECRET_KEY = "change-this-key-in-the-application-config"
JWT_SECRET_KEY = "change-this-key-to-something-different-in-the-application-config"
JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
JWT_BLACKLIST_ENABLED = True
JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
