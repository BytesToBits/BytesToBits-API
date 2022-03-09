from datetime import datetime, timedelta
from flask import request
from flask_restful import Resource, abort
from db import Tokens, Accounts
from db.core import BaseDb
from handlers.form_response import response

reset_time = datetime.utcnow()-timedelta(minutes=1)

def update_timers():
    global reset_time
    reset_time = datetime.utcnow()+timedelta(minutes=1)

class RateLimited(Resource):
    def get(self):
        return response(request.headers["Authorization"], { "message": "You are being rate-limited!"}, 429)

class UnAuthorized(Resource):
    def get(self):
        return abort(401, message="Unauthorized")   

def check_token(headers, endpoint=None):
    print(reset_time-datetime.utcnow())
    if datetime.utcnow() >= reset_time:
        BaseDb("API", "tokens").col.update_many({}, { "$set": {"uses": 0 } })
        update_timers()
    
    if not "Authorization" in headers:
        return UnAuthorized().get

    token = headers["Authorization"]

    if not Accounts.find_by_token(token): return UnAuthorized().get

    token = Tokens(token)

    if token.is_ratelimited():
        if token.get_one(token=token.token)["ratelimited"] <= datetime.utcnow():
            token.col.update_one({"token": token.token}, {"$set": {"ratelimited": False}})
        else:
            return RateLimited().get 

    if token.uses() >= 50:
        token.ratelimit()
        return RateLimited().get

    if endpoint:
        token.record(endpoint)