from .core import BaseDb
from datetime import datetime, timedelta

class Tokens(BaseDb):
    def __init__(self, token, *args, **kwargs):
        self.token = token
        super().__init__("API", "tokens")
        self.make_doc()
    
    def make_doc(self):
        if not self.get_one(token=self.token):
            self.col.insert_one({
                "token": self.token,
                "uses": 0,
                "actions": [],
                "ratelimit-multi": 1.0,
                "ratelimited": False
            })

    def record(self, endpoint):
        actions: list = self.get_one(token=self.token)["actions"]

        actions.insert(0, {
            "endpoint": endpoint,
            "date": datetime.utcnow()
        })

        self.col.update_one({
            "token": self.token
        }, {
            "$inc": {
                "uses": 1
            },
            "$set": {
                "actions": actions
            }
        })
    
    def ratelimit(self):
        DOC = self.get_one(token=self.token)
        self.col.update_one({
            "token": self.token
        }, {
            "$inc": {
                "ratelimit-multi": 0.1
            },
            "$set": {
                "ratelimited": datetime.utcnow()+timedelta(seconds=60*DOC["ratelimit-multi"])
            }
        })
    
    def is_ratelimited(self):
        return self.get_one(token=self.token)["ratelimited"]
    
    def uses(self):
        return self.get_one(token=self.token)["uses"]