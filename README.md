# **BytesToBits API** (Source)
This is the source code of the [BytesToBits API](https://api.bytestobits.dev/). You are allowed to clone & host your own version of the API.

## **How to Setup**
> *__You must have two servers, one for the Documentation and one for the API. A domain name is also required.__*  

The Documentation is located in the `frontend` folder and is made using **Next.js**. Thus, you will need a server that can host Next.js projects. Thankfully you can use [Vercel](https://vercel.com/) to put the website online for free.  

The API is located in the `api` folder and is made using **Python & Flask**. Any website host that can support flask applications can be used for the API. Unfortunately we do not have any free providers you can use.

### **Preparing the Database**
You can get a free **500MB** Database from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). That will last for a really long time.

Head over to Atlas and create a new account. You will then be greeted with this panel.
![Panel View](https://user-images.githubusercontent.com/44692189/64170897-1297a600-ce73-11e9-910e-38b78c3ac315.jpg)

Select the `FREE` one and give it a name. Follow these steps;
- Go to `Database Access` section under the `Security` tab and click `+ ADD NEW USER`. Give it `Read and write to any database` permissions so the bot can properly store the data. Give it a username and a **secure** password. Save the password only.
![New User](https://i.imgur.com/zfhxyNX.png)
- To allow the bot to actually access the database, you should whitelist all IP's. Go to `Network Access` section under the `Security` tab and click `+ ADD IP ADDRESS`. Click the `Allow Access From Everywhere` and `0.0.0.0/0` should appear in the `Whitelist Entry`. If it doesn't, enter it manually. Lastly, click confirm.
![Whitelist All IP's](https://i.imgur.com/UgIYkoA.png)
- Time to connect to the Database! Go to `Cluster` under the `DATA STORAGE` tab. If your database is still setting up, please wait until it's done! Once it is, click the `CONNECT` button and `Connect Your Application`. Copy a link that **looks** like this; `mongodb+srv://<username>:<password>@cluster0.r4nd0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
- Lastly, remove the `myFirstDatabase?retryWrites=true&w=majority` part and replace `<username>` with your user's name (sometimes it is already replaced in if there's only one user), and `<password>` with your saved password.
- Your database is done!

### **Configuring the Documentation**
Head over to the `frontend` folder and rename `config.example.json` to `config.json`.  
You will need a **SendGrid API Key** to create the API. [Check this video on how to get one.](https://www.youtube.com/watch?v=DA2ubUEV1uQ)  
Paste the Database URI link you created earlier in the `mongoUri` field.  
The `secret` field must be a **secure** string that will be used in many areas, including authentication. **DO NOT** leak that secret.  
The `url` and `apiUrl` fields must have respectively the documentation and the api url.

Rename `.env.example` to `.env` and paste the documentation URL in the `NEXTAUTH_URL` field.

> **To run the documentation:** Use `npm i` inside the `frontend` folder to install the dependencies. Then you can use `npm run build` and `npm run start` to run the production build, or just `npm run dev` (without building) for the development build.

### **Configuring the API**
Head over to the `api` folder and rename `config.example.json` to `config.json`.  
Paste the Database URI link in the `mongoUri` field. It must be the same with the documentation's URI.  
Get a [Genius API Key](https://docs.genius.com/) and paste it in the `geniusKey` field.  
Rename `data.example` to `data`, and feel free to edit the values in the JSON files inside the folder to modify the API storage. Updates are real-time, which means you won't need to restart the API to update the values.

> **To run the API:** Use `pip install -r requirements.txt` inside the `api` folder, and then `python main.py` to start the API.

## **Contributing**
All contributions of any kind are welcome. Make sure that you explain in detail all the changes you have made in the Pull Request. Our team will review your request as soon as possible. If you are planning on working on a new endpoint for the API and need some help, reach out to us in the [Discord Server](https://discord.gg/5eM2ckC49n).

**If you are the maintainer of an API wrapper**, join the discord server above and message an administrator! We will link your wrapper in this repository!