Apply a transparency filter to an image. It is also optional to add a background image.  
**Arguments:**  
`image`: Image URL to convert. *REQUIRED*  
`color`: The message content (default: ffffff). *OPTIONAL*  
`strength`: Color check strength (default: 20). *OPTIONAL*  
`background`: Background image to apply. *OPTIONAL*  
**Example:**
```py
import requests
from PIL import Image
from io import BytesIO

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/image/transparent?image=https://cdn.discordapp.com/attachments/718575580731408455/951088951798689812/2e8cde47c6d3d5c53847ad55a8a7d564.jpg&color=070b16&strength=40", headers={
    "Authorization": api_key
})

img_bytes = BytesIO(response.content)
image = Image.open(img_bytes)

image.show()
```