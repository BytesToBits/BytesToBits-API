import json

def read_json(file_name):
    return json.load(open(f"data/{file_name}.json", "r"))