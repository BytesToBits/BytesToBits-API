import json

from . import youtube_handler as Youtube

config = lambda: json.load(open("config.json", "r"))