Returns a random word from our storage in JSON format.  
**Example:**
```py
import requests

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/word/", headers={
    "Authorization": api_key
})

word = response.json()
print(word)
```