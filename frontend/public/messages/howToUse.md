Let's get you started with the API!
- First of all, **[Obtain Your API Key](/me)**! Keep this hidden, as you are the registered owner of the token, and all requests will be done on ***your*** behalf!
- **Write Code!** Yep, it was that easy. Once you get your API Key you can start using the API. Here are some examples:

## Python Example
```py
import requests

api_key = "YourApiKey"
headers = {
    "Authorization": api_key
}
url = "https://api.bytestobits.dev/text/"

response = requests.get(url, headers)
text = response.json()

print(text)
```

## JavaScript Example
```js
const apiKey = "YourApiKey"
let url = "https://api.bytestobist.dev/text/"

fetch(url, {
    method: "POST",
    headers: {
        Authorization: apiKey
    }
}).then(response => response.json()).then(text => console.log(text))
```

For more information on how to use the API and the available endpoints, check the [documentation](/documentation) page.