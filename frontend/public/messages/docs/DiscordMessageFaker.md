Returns a fake Discord message as an image. Markdown and mentions are **not** supported (yet).  
**Arguments:** (all arguments are optional)  
`avatar_url`: Image URL for the message author.  
`message`: The message content.  
`name`: The name of the author.  
`color`: The name color of the author, must be in HEX (without # in front of it).  
**Example:**
```py
import requests
from PIL import Image
from io import BytesIO

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/image/discord-message-faker?message=Hey+there!!&name=Bob&color=63f72c", headers={
    "Authorization": api_key
})

img_bytes = BytesIO(response.content)
image = Image.open(img_bytes)

image.show()
```