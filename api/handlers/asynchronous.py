import asyncio

def make_async(func):
    def wrap(*args, **kwargs):
        return asyncio.run(func(*args, **kwargs))
    
    return wrap