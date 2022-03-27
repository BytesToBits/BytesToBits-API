from io import BytesIO
from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response
from handlers.tokens import check_token
from db import Error
from PIL import Image
import imagehash, requests


class Similarity(Resource):
    endpoints: ClassVar[list] = ["/image/similarity", "/image/similarity/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, Similarity.endpoints[1])
        if err: return err()

        image_one = request.args.get("compare")
        image_two = request.args.get("to")

        if not (image_one and image_two):
            return response(token, { "message": "'compare' and 'to' are required arguments" }, 400)

        try:
            image_one = requests.get(image_one)
            image_two = requests.get(image_two)

            print(image_one)
            print(image_two)

            hash1 = imagehash.average_hash(Image.open(BytesIO(image_one.content)))
            hash2 = imagehash.average_hash(Image.open(BytesIO(image_two.content)))
    
            rate = hash1-hash2

            strictness = request.args.get("strictness") or 5

            similar = hash1 - hash2 <= int(strictness)

            return response(token, { "similarity_rate": rate, "similar": similar })

        except Exception as e:
            code = Error(error=str(e))
            return response(token, {
                "message": "an error ocurred",
                "error": str(e),
                "code": code.code
            }, 500)

