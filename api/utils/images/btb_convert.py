from PIL import Image, ImageOps
from io import BytesIO

import requests

async def btbify(image):
    canvas = Image.new('RGBA', (500,500), (0,0,0,0))

    image = Image.open(BytesIO(requests.get(image).content))
    image =ImageOps.fit(image, canvas.size, centering=(.5,.5))
    mask = Image.open("utils/images/assets/btb_mask.png").convert("L")
    mask = ImageOps.fit(mask, image.size, centering=(.5, .5))
    
    canvas.paste(image, mask=mask)
    
    img_bytes = BytesIO()
    canvas.save(img_bytes, format="PNG")
    return img_bytes.getvalue()