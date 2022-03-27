from .text import Text
from .lyrics import Lyrics
from .word import Word
from .translate import Translate

from .image.discord_message_faker import DiscordMessageFaker
from .image.convert import Convert
from .image.btbify import BTBIFY
from .image.transparent import Transparent
from .image.hue_shift import HueShift
from .image.similarity import Similarity

Resources = (
    Text,
    Lyrics,
    Word,
    Translate,

    DiscordMessageFaker,
    Convert,
    BTBIFY,
    Transparent,
    HueShift,
    Similarity
)