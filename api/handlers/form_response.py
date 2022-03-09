from datetime import datetime
from db import Tokens

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