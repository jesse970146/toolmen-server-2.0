from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from flask_restful import abort
from functools import wraps

from functions.strings import gettext
from models.user import UserModel

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request(fresh=True)
            claims = get_jwt_identity()
            user = UserModel.find_by_id(claims)
            if user.is_admin:
                 return fn(*args, **kwargs)
            else:
                return {"message": "Permission denied"}, 403
        return decorator
    return wrapper

def active_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
        
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = UserModel.find_by_id(user_id)
            print(user.actived)
            if user.actived:
                 return fn(*args, **kwargs)
            else:
                abort (403, message= gettext("Not actived"))
        return decorator
    return wrapper