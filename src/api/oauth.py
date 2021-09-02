from flask import Flask,Blueprint,request,redirect
from oauthlib.oauth2 import WebApplicationClient
import requests
import json
import os
import src.api.sql as sql
import src.api.token as jwt

listener = Blueprint("oauth",__name__)
urlTag = "/api/v1"

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

GOOGLE_CLIENT_ID = "676611541312-bagura9sm1tieiooak8tgkcpt0vfhkok.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "5VgaRKcrrmK1slbRGfw4ASZV"
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)
GOOGLE_REDIRECT_URL = "http://localhost:3000/googlelogin"

client = WebApplicationClient(GOOGLE_CLIENT_ID)

def getGoogleProviderCfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@listener.route(urlTag+"/oauth/getgoogleuri",methods=["GET"])
def googleLogin():
    googleProviderCfg = getGoogleProviderCfg()
    authorization_endpoint = googleProviderCfg["authorization_endpoint"]
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=GOOGLE_REDIRECT_URL,
        scope=["openid", "email", "profile"],
    )

    return {
        "response":"ok",
        "uri":request_uri
    }

@listener.route(urlTag+"/oauth/google/gettoken",methods=["GET"])
def getTokenFromGoogle():
    try:
        googleProviderCfg = getGoogleProviderCfg()
        token_endpoint = googleProviderCfg["token_endpoint"]            
        code = request.args.get("code")            
        token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=GOOGLE_REDIRECT_URL,
        code=code
        )

        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )
        client.parse_request_body_response(json.dumps(token_response.json()))

        userinfo_endpoint = googleProviderCfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)

        if userinfo_response.json().get("email_verified"):
            unique_id = userinfo_response.json()["sub"]
            users_email = userinfo_response.json()["email"]
            picture = userinfo_response.json()["picture"]
            users_name = userinfo_response.json()["given_name"]
            
            _user = sql.getUserFromMail(users_email)
            if len(list(_user)) > 0:
                user_id = _user[0][0]
                pass_hash = _user[0][2]
                if pass_hash == "googleuser":
                    token = jwt.encodeToken(user_id)
                    return {
                        "response":"ok",
                        "token":str(token)
                    }
                else:
                    return {
                        "response":"User is not registered to google account."
                    }
            else:
                sql.addUser(users_email,"googleuser")
                _id = sql.getUserFromMail(users_email)[0][0]
                token = jwt.encodeToken(_id)
                return {
                    "response":"ok",
                    "token":str(token)
                }
        else:
            return {
                "response":"User email not available or not verified by Google."
            }

    except Exception as e:
        return {
            "response":str(e)
        }
