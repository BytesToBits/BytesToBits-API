from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from endpoints import Text, Lyrics, Word, Translate, DiscordMessageFaker
from handlers.asynchronous import make_async

app = Flask(__name__)
api = Api(app)
CORS(app)

@app.route("/")
@make_async
async def index():
    return "<h1>Welcome to the BytesToBits API</h1>"

for REACH in [Text, Lyrics, Word, Translate, DiscordMessageFaker]:
    api.add_resource(REACH, *REACH.endpoints)

app.run(debug=True)