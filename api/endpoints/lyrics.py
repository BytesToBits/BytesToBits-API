from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response
from handlers.tokens import check_token

from utils import genius


class Lyrics(Resource):
    endpoints: ClassVar[list[str]] = ["/lyrics", "/lyrics/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, Lyrics.endpoints[1])
        if err: return err()

        song = request.args.get("song")
        author = request.args.get("author")

        if not song:
            return response(token, { "message": "'song' is a required argument" }, 400)
        
        genius_song = genius.get(song, author)

        if not genius_song:
            return response(token, { "message": "song not found" }, 400)
        
        return response(token, genius_song, 200)
        
