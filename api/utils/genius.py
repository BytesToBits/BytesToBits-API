import lyricsgenius

from handlers import config

genius = lyricsgenius.Genius(config()["geniusKey"])

def get(name, author):
    song = genius.search_song(name, author if author else "")
    if not song:
        return None
    
    return {
        "title": song.title,
        "artist": song.artist,
        "lyrics": song.lyrics
    }