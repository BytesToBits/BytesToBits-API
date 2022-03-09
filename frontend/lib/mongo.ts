import { MongoClient } from "mongodb"
import Config from "../config.json"

const uri = Config.mongoUri
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client: MongoClient
let clientPromise

if (!uri) {
  throw new Error("Please add your mongoUri to config.json")
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise