from .core import BaseDb

def find_by_token(token):
    return BaseDb("Main", "Accounts").get_one(token=token)