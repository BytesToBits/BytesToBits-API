Like we mentioned before, you are allowed **50 requests per minute** on the API. Surpassing that limit will result in an instant rate-limit.  
The first rate-limit will last for a minute. However, we store the times a token has been rate-limited, and the timeout increases on each addition.  
The formula for calculating the rate-limit timeout is as follows: `1+(0.1*RateLimitCount) minutes`, pretty simple, right?  
It might not look much time at first, but continuously surpassing the limit **will** result in a very long timeout. This is why we can tell you exactly how to prevent getting rate-limited in the first place!  
## Check the headers
That's it. The headers contain the following keys: **X-RateLimit-Limit, X-Rate-Limit-Remaining, X-Rate-Limit-Reset**  
So, what does each of these do?
- **X-RateLimit-Limit** returns the amount of requests the token is allowed to make. That is a constant value for default tokens, and it does not get affected by whether or not the token is rate-limited.
- **X-RateLimit-Remaining** returns the amount of requests the token is allowed to make __before getting rate-limited__. If this hits 0, it means the next request will rate-limit the token.
- **X-Rate-Limit-Reset** returns the remaining seconds before the rate-limit is removed! If the token is not rate-limited, the value will be `0`.
### *Here is a very bad example on how to prevent rate-limits. You're better off making your own logic.*
```py
import requests

remaining = None

def api_call(url, *args, **kwargs):
    global remaining
    # If "remaining" is None or over 0, it means we can make requests!
    if not remaining or remaining > 0:
        response = requests.get(url, *args, **kwargs)

        # Save the header values in the variable
        remaining = response.headers["X-RateLimit-Remaining"]

        return response
    
    else:
        print("You cannot make another request yet!")
        return None

res = api_call("https://api.bytestobits.dev/text", headers={"Authorization":"YourApiKey"})

if res:
    print(res.json())
```