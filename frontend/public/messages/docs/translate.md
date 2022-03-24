Translate a string to another language.  
**Arguments:**  
`to`: The language to translate the text into. *REQUIRED*  
`text`: The string to translate. *REQUIRED*  
`from`: The origin language of the string. *OPTIONAL*  
**Example:**
```py
import requests

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/translate?from=nl&to=en&text=Hoi!'", headers={
    "Authorization": api_key
})

translated_text = response.json()
print(translated_text)
```