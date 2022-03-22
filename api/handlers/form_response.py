from datetime import datetime
from db import Tokens
from flask import make_response, send_file

def response_file(token, data, status=200, headers={}):
    token = Tokens(token)
    reset = 0
    if token.is_ratelimited():
        reset = (token.get_one(token=token.token)["ratelimited"] - datetime.utcnow()).seconds

    res = make_response(send_file(data, mimetype="image/png", attachment_filename="api-bytestobits-dev-generated-message.png"))
    res.headers = {
        **headers,
        "X-RateLimit-Limit": 50,
        "X-Rate-Limit-Remaining": 50-token.uses(),
        "X-Rate-Limit-Reset": reset,
        "Content-Type": "image/png"
    }
    res.status = status

    return res

def response(token, data, status=200, headers={}):
    token = Tokens(token)
    reset = 0
    if token.is_ratelimited():
        reset = (token.get_one(token=token.token)["ratelimited"] - datetime.utcnow()).seconds

    return data, status, {
        **headers,
        "X-RateLimit-Limit": 50,
        "X-Rate-Limit-Remaining": 50-token.uses(),
        "X-Rate-Limit-Reset": reset
    }