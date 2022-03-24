Returns a random text from our storage in JSON format.  
**Example:**
```py
import requests

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/text/", headers={
    "Authorization": api_key
})

text = response.json()
print(text)
```