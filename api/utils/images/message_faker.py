import requests, textwrap

from PIL import Image, ImageFont, ImageDraw, ImageOps, ImageColor
from io import BytesIO
from datetime import datetime

DEFAULT_AVATAR = "https://i.pinimg.com/564x/70/a6/08/70a60868bcef89d9bc93c7693af1481e.jpg"
DEFAULT_MESSAGE = "Hello!"
DEFAULT_NAME = "BytesToBits"
DEFAULT_COLOR = "ffffff"

MESSAGE_WIDTH = 720
MESSAGE_HEIGHT = 48
LINE_HEIGHT = 5
FONT_SIZE = 16
BG_COLOR = (54, 57, 64) # dark mode
TEXT_MARGIN = 60
AVATAR_SIZE = (40,40)

async def make_message(avatar_url=DEFAULT_AVATAR, message=DEFAULT_MESSAGE, name=DEFAULT_NAME, color=DEFAULT_COLOR, *args, **kwargs):
    message = message[:2000]
    color = ImageColor.getcolor(f"#{color}", 'RGB')
    lines = textwrap.wrap(message, width=100)

    canvas = Image.new('RGB', (MESSAGE_WIDTH, MESSAGE_HEIGHT+(FONT_SIZE+LINE_HEIGHT)*(len(lines)-1)), BG_COLOR)
    draw = ImageDraw.Draw(canvas)

    avatar = Image.open(BytesIO(requests.get(avatar_url).content))
    mask = Image.open("utils/images/assets/round_mask.png").convert("L")
    mask = ImageOps.fit(mask, AVATAR_SIZE, centering=(.5,.5))
    avatar = ImageOps.fit(avatar, mask.size, centering=(.5,.5))
    canvas.paste(avatar, (10, 4), mask=mask)

    name_font = ImageFont.truetype("utils/images/assets/whitney-semibold.otf", size=FONT_SIZE)
    
    name_width, _ = draw.textsize(text=name, font=name_font)
    draw.text(xy=(TEXT_MARGIN, 5), text=name, font=name_font, fill=color)
    
    text_font = ImageFont.truetype("utils/images/assets/whitney-medium.otf", size=FONT_SIZE-5)
    draw.text(xy=(TEXT_MARGIN+name_width+8, 10), text=datetime.utcnow().strftime("Today at %I:%m %p"), font=text_font, fill=(108, 111, 118))

    text_font = ImageFont.truetype("utils/images/assets/whitney-medium.otf", size=FONT_SIZE-1)

    for (index, line) in enumerate(lines):
        draw.text(xy=(TEXT_MARGIN, 25+(FONT_SIZE+LINE_HEIGHT)*index), text=line, font=text_font, fill=(230,230,230))

    img_bytes = BytesIO()
    canvas.save(img_bytes, format="PNG")
    return img_bytes.getvalue()