from datetime import datetime
from .core import BaseDb
from uuid import uuid4

class Error(BaseDb):
    def __init__(self, **kwargs):
        super().__init__("Errors", "api_log")
        self.code = str(uuid4())
        self.col.insert_one({
            "_id": self.code,
            "date": datetime.utcnow(),
            **kwargs
        })