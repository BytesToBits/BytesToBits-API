from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response
from handlers.tokens import check_token

import random

from utils import read_json


class Text(Resource):
    endpoints: ClassVar[list] = ["/text", "/text/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, Text.endpoints[1])
        if err: return err()

        isAll = request.args.get("all").__str__()

        texts = read_json("texts")

        if isAll.lower() == "true":
            return response(token, texts, 200)
        
        return response(token, random.choice(texts), 200)