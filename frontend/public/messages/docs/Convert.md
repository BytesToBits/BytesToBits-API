Convert an image into different formats. The allowed formats are: `png, jpg, jpeg, webp, bmp, L`.  
**Arguments:**  
`image`: Image URL to convert. *REQUIRED*  

**Example:**
```py
import requests
from PIL import Image
from io import BytesIO

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/image/convert?image=https://i.imgur.com/fItNMCG.png&to=L", headers={
    "Authorization": api_key
})

img_bytes = BytesIO(response.content)
image = Image.open(img_bytes)

image.show()
```