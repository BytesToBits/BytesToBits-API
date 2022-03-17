from flask import Flask, redirect
from flask_restful import Api
from flask_cors import CORS

from endpoints import Text, Lyrics, Word, Translate, DiscordMessageFaker, BTBIFY
from handlers.asynchronous import make_async

app = Flask(__name__)
api = Api(app)
CORS(app)

@app.route("/")
@make_async
async def index():
    return redirect("https://docs.bytestobits.dev/")

for REACH in [Text, Lyrics, Word, Translate, DiscordMessageFaker, BTBIFY]:
    api.add_resource(REACH, *REACH.endpoints)

app.run(debug=True)