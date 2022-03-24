Returns the lyrics of a song from [Genius](https://genius.com/).  
**Arguments:**  
`song`: The name of the song to fetch the lyrics from. *REQUIRED*  
`author`: The author of the song. *OPTIONAL*  
**Example:**
```py
import requests

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/text/", headers={
    "Authorization": api_key
})

lyrics = response.json()
print(lyrics)
```