import os.path

import requests
from PIL import Image
from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.tokens import check_token
from urllib.parse import urlparse
import urllib.request
from handlers.form_response import response_file, response
from io import BytesIO


class Convert(Resource):
    endpoints: ClassVar[list] = ["/image/convert", "/image/convert/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, Convert.endpoints[1])
        if err: return err()

        image = request.args.get("image")
        to = "jpeg" if request.args.get("to") == "jpg" else request.args.get("to")

        if to not in ("jpeg", "png", "webp", "bmp", "L"):
            return response(token, {"message": "conversion type not supported, please choose jpg/jpeg, png, bmp, L (for black & white), or webp"}, 400)

        url_request = requests.get(image)
        if not url_request.headers["content-type"].startswith("image"):
            return response(token, {"message": "Url provided has to be an Image"}, 400)

        img_bytes = BytesIO(url_request.content)

        img = Image.open(img_bytes).convert("RGB")

        if to == "L": img = img.convert('L')

        img_bytes = BytesIO()
        img.save(img_bytes, to if to != "L" else "png")
        return response_file(token, BytesIO(img_bytes.getvalue()))
