from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response
from handlers.tokens import check_token

import random

from utils import read_json


class Word(Resource):
    endpoints: ClassVar[list] = ["/word", "/word/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, Word.endpoints[1])
        if err: return err()

        word = random.choice(read_json("words"))
        
        return response(token, word, 200)