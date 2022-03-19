from io import BytesIO
from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response_file, response
from handlers.tokens import check_token
from db import Error
from utils.images import make_transparent


class Transparent(Resource):
    endpoints: ClassVar[list[str]] = ["/image/transparent", "/image/transparent/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, Transparent.endpoints[1])
        if err: return err()
        
        try:
            image_data = await make_transparent(**request.args)
        except Exception as e:
            code = Error(error=str(e))
            return response(token, {
                "message": "an error ocurred",
                "error": str(e),
                "code": code.code
            }, 500)
        
        return response_file(token, BytesIO(image_data))
        
