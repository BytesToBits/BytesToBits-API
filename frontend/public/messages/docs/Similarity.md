Check if two images are similar.  
**Arguments:**  
`compare`: Original image URL. *REQUIRED*  
`to`: Image URL to compare with. *REQUIRED*  
`strictness`: Change the strictness of the comparison (default=5). *OPTIONAL*  

**Example:**
```py
import requests

api_key = "YOURAPIKEY"

response = requests.get("https://api.bytestobits.dev/image/similarity?compare=https://cdn.discordapp.com/attachments/614909956881121308/956591164289593385/Level-Card-BytesToBits.png&to=https://cdn.discordapp.com/attachments/614909956881121308/956598111697010769/Level-Card-BytesToBits.png", headers={
    "Authorization": api_key
})
```