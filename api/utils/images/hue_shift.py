from PIL import Image
from io import BytesIO
import requests

import colorsys
import numpy as np

rgb_to_hsv = np.vectorize(colorsys.rgb_to_hsv)
hsv_to_rgb = np.vectorize(colorsys.hsv_to_rgb)

def shift_hue(arr, hout):
    r, g, b, a = np.rollaxis(arr, axis=-1)
    h, s, v = rgb_to_hsv(r, g, b)
    h = hout
    r, g, b = hsv_to_rgb(h, s, v)
    arr = np.dstack((r, g, b, a))
    return arr

async def change_hue(image, shift=10):
    image = Image.open(BytesIO(requests.get(image).content)).convert('RGBA')
    arr = np.array(np.asarray(image).astype('float'))
    image = Image.fromarray(shift_hue(arr, int(shift)/360.).astype('uint8'), 'RGBA')

    img_bytes = BytesIO()
    image.save(img_bytes, format="PNG")
    return img_bytes.getvalue()