
import os 

# secrets -> non secrets -> use default config
DEBUG = False
SQLALCHEMY_TRACK_MODIFICATIONS = False
PROPAGATE_EXCEPTIONS = True
JWT_BLACKLIST_ENABLED = True
JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

# secrets -> use env
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

