from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response
from handlers.tokens import check_token
from handlers import Youtube


class YoutubeSearch(Resource):
    endpoints: ClassVar[list] = ["/beta/youtube", "/beta/youtube/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, YoutubeSearch.endpoints[1])
        if err: return err()

        query = request.args.get("query")

        if not query:
            return response(token, { "message": "'query' is a required argument" }, 400)
        
        return response(token, Youtube.find_and_download(query), 200)
        
