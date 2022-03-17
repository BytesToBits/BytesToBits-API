from flask_restful import Resource, request
from typing import ClassVar
from handlers.asynchronous import make_async
from handlers.form_response import response
from handlers.tokens import check_token
from googletrans import Translator
from db import Error

class TranslateEndPoint(Resource):
    endpoints: ClassVar[list[str]] = ["/translate", "/translate/"]

    @make_async
    async def get(self):
        err, token = check_token(request.headers, "/translate/")
        if err: return err()

        from_lang = request.args.get("from") or 'auto'
        to_lang = request.args.get("to") or 'en'
        text = request.args.get("text")

        print(text)

        if not text:
            return response(token, { "message": "'text' is a required argument" }, 400)
        
        try:
            translation = Translator().translate(text=text, dest=to_lang, src=from_lang)
            return response(token, translation.text, 200)
        except Exception as e:
            code = Error(error=str(e))
            return response(token, {
                "message": "an error ocurred",
                "error": str(e),
                "code": code
            }, 500)