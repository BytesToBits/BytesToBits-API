import Config from "../config.json"

export default async function getText(text) {
    const res = await fetch(`${Config.url}/messages/` + text + ".txt")

    return await res.text()
}