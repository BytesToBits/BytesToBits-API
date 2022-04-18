import youtube_dl, youtube_search

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
    search_results = youtube_search.YoutubeSearch(query).to_dict()

    if not search_results:
        return None
    
    url = "https://www.youtube.com/" + search_results[0]["url_suffix"]

    data = ytdl.extract_info(url, download=False)
    
    return {
        "download": data["url"],
        "title": data["title"],
        "publisher": data["uploader"],
        "image": data["thumbnail"]
    }