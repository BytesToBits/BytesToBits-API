from math import isclose
from PIL import Image, ImageColor, ImageOps
from io import BytesIO

import requests

async def clear_background(image, color="#ffffff", strength=20, background=None):
    image = Image.open(BytesIO(requests.get(image).content)).convert('RGBA')
    image_data = image.load()

    color = ImageColor.getcolor(color, 'RGBA')
    replacement = (0,0,0,0)

    for y in range(image.height):
        for x in range(image.width):
            if isclose(sum(image_data[x,y]), sum(color), abs_tol=abs(int(strength))):
                image_data[x,y] = replacement

    if background:
        background = Image.open(BytesIO(requests.get(background).content)).convert('RGBA')
        background = ImageOps.fit(background, image.size, centering=(.5,.5))
        background.paste(image, mask=image)
        image = background


    img_bytes = BytesIO()
    image.save(img_bytes, format="PNG")
    return img_bytes.getvalue()