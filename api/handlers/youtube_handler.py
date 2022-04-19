import youtube_dl
from youtubesearchpython import VideosSearch

ytdl_format_options = {
    'format': 'bestaudio/best',
    'outtmpl': '%(extractor)s-%(id)s-%(title)s.%(ext)s',
    'restrictfilenames': True,
    'noplaylist': False,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0' # bind to ipv4 since ipv6 addresses cause issues sometimes
}

ffmpeg_options = {
    'options': '-vn'
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)

def find_and_download(query):
    search_results = VideosSearch(query, 1).result()

    if not search_results or not 'result' in search_results:
        return None
    
    url = search_results['result'][0]['link']

    data = ytdl.extract_info(url, download=False)
    
    return {
        "download": data["url"],
        "title": data["title"],
        "publisher": data["uploader"],
        "image": data["thumbnail"]
    }