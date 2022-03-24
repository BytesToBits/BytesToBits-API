Shift an image's hue.  
**Arguments:**  
`image`: Image URL to convert. *REQUIRED*  
`shift`: Hue shift to apply (default: 10). *OPTIONAL*

**Example:**
```py
import requests
from PIL import Image
from io import BytesIO

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/image/hue-shift?image=https://i.imgur.com/fItNMCG.png&shift=50", headers={
    "Authorization": api_key
})

img_bytes = BytesIO(response.content)
image = Image.open(img_bytes)

image.show()
```