from pymongo import MongoClient
from handlers import config

client = MongoClient(config()["mongoUri"])

class BaseDb:
    def __init__(self, db="", col=""):
        self.db = client[db]
        self.col = self.db[col]
    
    def get(self, **filter):
        return [i for i in self.col.find(filter)]
    
    def get_one(self, **filter):
        return self.col.find_one(filter)