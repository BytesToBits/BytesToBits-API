from flask import Flask, redirect
from flask_restful import Api
from flask_cors import CORS

from endpoints import Resources
from handlers.asynchronous import make_async

app = Flask(__name__)
api = Api(app)
CORS(app)

@app.route("/")
@make_async
async def index():
    return redirect("https://docs.bytestobits.dev/")

for Resource in Resources:
    api.add_resource(Resource, *Resource.endpoints)

app.run(debug=False)