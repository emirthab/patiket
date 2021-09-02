import jwt
import datetime

mysecret = "hiddensecret"

def encodeToken(user_id):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'userid': user_id
        }
        return jwt.encode(
            payload,
            mysecret,
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decodeToken(auth_token):
    try:
        payload = jwt.decode(auth_token, mysecret,algorithms="HS256")
        json = {
            "userid":payload["userid"],
            "response":"ok"
        }
        return json
    except jwt.ExpiredSignatureError:
        json = {
            "response":"Signature expired. Please log in again."
        }
        return json

    except jwt.InvalidTokenError:
        json = {
            "response":"Invalid token. Please log in again."
        }
        return json