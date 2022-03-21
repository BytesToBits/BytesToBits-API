import { MongoClient, MongoNotConnectedError } from "mongodb"
import Config from "../../config.json"

export const client = new MongoClient(Config.mongoUri)

async function Execute(__f) {
    try {

        const returnable = await __f(client)

        return returnable
    } catch (e) {
        //throw new Error(e)
        if (e instanceof MongoNotConnectedError) {
            await client.connect()
            return Execute(__f)
        }
        else {
            throw new Error(e)
        }
    }
}

const Database = {
    Execute,
}

export default Database