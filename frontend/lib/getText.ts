import Config from "../config.json"

export default async function getText(text) {
    const url = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : Config.url
    const res = await fetch(`${url}/messages/` + text + ".md")

    return await res.text()
}