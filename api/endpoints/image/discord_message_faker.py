from io import BytesIO
from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response_file, response
from handlers.tokens import check_token
from utils.images import DiscordMessage
from db import Error


class DiscordMessageFaker(Resource):
    endpoints: ClassVar[list[str]] = ["/image/discord-message-faker", "/image/discord-message-faker/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, DiscordMessageFaker.endpoints[1])
        if err: return err()

        try:
            image_data = await DiscordMessage(**request.args)
        except Exception as e:
            code = Error(error=str(e))
            return response(token, {
                "message": "an error ocurred",
                "error": str(e),
                "code": code.code
            }, 500)
        
        return response_file(token, BytesIO(image_data))
        
