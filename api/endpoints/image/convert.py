import os.path

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
    endpoints: ClassVar[list[str]] = ["/image/convert", "/image/convert/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, "/image/convert/")
        if err: return err()

        image = request.args.get("image")
        to = "jpeg" if request.args.get("to") == "jpg" else request.args.get("to")

        if to not in ("jpeg", "png", "webp", "bmp"):
            return response(token, {"message": "conversion type not supported, please choose jpg, png or webm"}, 400)

        filedata = urlparse(image)
        filename = os.path.basename(filedata.path)
        image_path = f"./image_pipe/{filename}"
        opener = urllib.request.URLopener()
        opener.addheader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36')
        filename, headers = opener.retrieve(image, image_path)
        img = Image.open(image_path).convert("RGB")

        img_bytes = BytesIO()
        img.save(img_bytes, to)
        os.remove(filename)
        return response_file(token, BytesIO(img_bytes.getvalue()))
